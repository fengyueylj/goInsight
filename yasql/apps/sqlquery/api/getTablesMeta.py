# -*- coding:utf-8 -*-
# edit by xff
import logging

import clickhouse_driver
import pymysql

logger = logging.getLogger('main')


class GetTablesMeta(object):
    def __init__(self, config=None, cid=None, rds_category=None):
        self.config = config
        self.cid = str(cid)
        self.rds_category = rds_category

    def _cnx(self, database=None):
        if database:
            self.config['database'] = database
        try:
            if self.rds_category in [1, 2]:
                cnx = pymysql.connect(**self.config)
                with cnx.cursor() as cursor:
                    cursor.execute('set session group_concat_max_len=1073741824;')
                return cnx
            if self.rds_category in [3]:
                # clickhouse
                cnx = clickhouse_driver.connect(**self.config)
                return cnx
        except Exception as err:
            logger.error(err)
            return None

    def get_table_structure(self, schema, table):
        """
        获取表结构信息
        """
        cnx = self._cnx(database=schema)
        if cnx:
            with cnx.cursor() as cursor:
                stru_query = f"show create table `{schema}`.`{table}`"
                cursor.execute(stru_query)
                if self.rds_category in [1, 2]:
                    data = cursor.fetchone()[1]
                if self.rds_category in [3]:
                    data = '\n\n'.join(cursor.fetchall()[0])
            cnx.close()
            return True, data
        return False, f"访问数据库{':'.join([self.config.get('host'), str(self.config.get('port'))])}异常，请联系DBA"

    def get_table_base(self, schema, table):
        """
        获取表基本信息
        """
        if self.rds_category in [1, 2]:
            # mysql & tidb
            cnx = self._cnx()
            if cnx:
                data = []
                cnx.cursorclass = pymysql.cursors.DictCursor
                with cnx.cursor() as cursor:
                    base_query = f"select TABLE_NAME as '表名', TABLE_TYPE as '表类型', ENGINE as '引擎', " \
                                 f"ROW_FORMAT as '行格式', TABLE_ROWS as '表行数(估算值)', " \
                                 f"round(DATA_LENGTH/1024, 2) as '数据大小(KB)', " \
                                 f"round(INDEX_LENGTH/1024, 2) as '索引大小(KB)', " \
                                 f"TABLE_COLLATION as '字符集校验规则', TABLE_COMMENT as '备注', " \
                                 f"CREATE_TIME as '创建时间'  from information_schema.tables where " \
                                 f"table_schema='{schema}' and table_name='{table}'"
                    cursor.execute(base_query)
                    for i in cursor.fetchall():
                        for k, v in i.items():
                            format_row = f"<tr><td>{k}</td><td>{v}</td></tr>"
                            data.append(format_row)
                cnx.close()
                return True, ''.join(data)
            return False, f"访问数据库{':'.join([self.config.get('host'), str(self.config.get('port'))])}异常，请联系DBA"
        return False, 'ClickHouse数据库不支持查看表基本信息'

    def get_tables_treedata(self, schema=None):
        query = None
        if self.rds_category in [1, 2]:
            # mysql & tidb
            query = f"select " \
                    f"table_name as `table`, " \
                    f"group_concat(concat(column_name, ' ', column_type) SEPARATOR '#') as `join_columns`, " \
                    f"group_concat(column_name) as `columns` " \
                    f"from information_schema.columns " \
                    f"where table_schema='{schema}' and table_name not regexp '^_(.*)[_ghc|_gho|_del]$' " \
                    f"group by table_schema, table_name order by table_name"
        if self.rds_category in [3]:
            # clickhouse
            query = f"""
                    SELECT
                        table,
                        join_columns,
                        columns
                    FROM 
                    (
                        SELECT
                            database,
                            table,
                            groupArray(concat_col_type) AS col_type_array,
                            arrayStringConcat(col_type_array, '#') AS join_columns,
                            groupArray(column) AS col_array,
                            arrayStringConcat(col_array, ',') AS columns
                        FROM 
                        (
                            SELECT
                                database,
                                table,
                                concat(name, ' ', type) AS concat_col_type,
                                name AS column
                            FROM system.columns
                            WHERE (database = '{schema}')
                        )
                        GROUP BY
                            database,
                            table
                    )
                    ORDER BY table ASC
                    """

        cnx = self._cnx(database=schema)
        if cnx:
            try:
                tree_data = []
                tab_completion = {}
                cursor = cnx.cursor()
                cursor.execute(query)
                for table, join_columns, columns in cursor.fetchall():
                    # 自动补全
                    tab_completion[table] = columns.split(',')

                    # tree结构
                    columns_children = [
                        {
                            'label': i,
                            'icon': 'el-icon-tickets',
                            'key': '___'.join([self.cid, schema, table, i]),
                            'isLeaf': True,
                        } for i in join_columns.split('#')
                    ]
                    tree_data.append(
                        {
                            'label': table,
                            'icon': 'el-icon-notebook-2',
                            'key': '___'.join([self.cid, schema, table]),
                            'children': columns_children
                        }
                    )
                cursor.close()
                cnx.close()
            except Exception as err:
                logger.error(err)
                return False, f"访问数据库{':'.join([self.config.get('host'), str(self.config.get('port'))])}异常，请联系DBA"
            return True, {'tree_data': tree_data, 'tab_completion': {'tables': tab_completion}}
        return False, f"访问数据库{':'.join([self.config.get('host'), str(self.config.get('port'))])}异常，请联系DBA"

    def get_db_dict(self, schema=None):
        if self.rds_category in [1, 2]:
            # mysql & tidb
            query = f"select t.TABLE_NAME,if(t.TABLE_COMMENT!='',t.TABLE_COMMENT,'None'),t.CREATE_TIME," \
                    f"group_concat(distinct concat_ws('<b>', c.COLUMN_NAME,c.COLUMN_TYPE,if(c.IS_NULLABLE='NO','NOT NULL','NULL')," \
                    f"ifnull(c.COLUMN_DEFAULT, ''),ifnull(c.CHARACTER_SET_NAME,''), ifnull(c.COLLATION_NAME,'')," \
                    f"ifnull(c.COLUMN_COMMENT, '')) separator '<a>') as COLUMNS_INFO," \
                    f"group_concat(distinct concat_ws('<b>', s.INDEX_NAME,if(s.NON_UNIQUE=0,'唯一','不唯一'),s.Cardinality," \
                    f"s.INDEX_TYPE,s.COLUMN_NAME) separator '<a>') as INDEX_INFO " \
                    f"from COLUMNS c join TABLES t on c.TABLE_SCHEMA = t.TABLE_SCHEMA and c.TABLE_NAME = t.TABLE_NAME " \
                    f"left join STATISTICS s on c.TABLE_SCHEMA = s.TABLE_SCHEMA and c.TABLE_NAME = s.TABLE_NAME " \
                    f"where t.TABLE_SCHEMA='{schema}' " \
                    f"group by t.TABLE_NAME,t.TABLE_COMMENT,t.CREATE_TIME"
            cnx = self._cnx()
            if cnx:
                with cnx.cursor() as cursor:
                    cursor.execute(query)
                    return True, cursor.fetchall()
            return False, f"访问数据库{':'.join([self.config.get('host'), str(self.config.get('port'))])}异常，请联系DBA"
        return False, 'ClickHouse数据库不支持查看数据字典'
