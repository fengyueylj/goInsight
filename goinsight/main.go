package main

import (
	"embed"
	"flag"
	"fmt"
	"goInsight/bootstrap"
	"goInsight/global"
	"goInsight/middleware"
	"goInsight/routers"
	"io/fs"
	"net/http"
	"os"
	"strings"

	commonRouter "goInsight/internal/common/routers"
	dasRouter "goInsight/internal/das/routers"
	inspectRouter "goInsight/internal/inspect/routers"
	ordersRouter "goInsight/internal/orders/routers"
	userRouter "goInsight/internal/users/routers"

	"github.com/gin-gonic/gin"
)

// 定义版本
var version string

// 读取本地配置文件
var ConfigFile = flag.String("config", "config.yaml", "config file")

//go:embed dist
var staticFS embed.FS

func RunServer() {
	// 生产环境模式
	if global.App.Config.App.Environment == "prod" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 初始化认证中间件
	var err error
	if global.App.JWT, err = middleware.InitAuthMiddleware(); err != nil {
		fmt.Println("Failed to initialize authentication middleware:", err)
		return
	}

	// 加载多个APP的路由配置
	routers.Include(
		userRouter.Routers,
		commonRouter.Routers,
		inspectRouter.Routers,
		dasRouter.Routers,
		ordersRouter.Routers,
	)

	// 初始化路由
	r := routers.Init()

	// 嵌入的文件系统
	st, err := fs.Sub(staticFS, "dist")
	if err != nil {
		fmt.Println("Error accessing embedded filesystem:", err)
		return
	}
	r.StaticFS("/static", http.FS(st))

	// 提供其他非嵌入的文件系统
	if _, err := os.Stat("./media"); os.IsNotExist(err) {
		os.MkdirAll("./media", os.ModePerm)
	}
	r.Static("/media", "./media")

	// 默认头像文件
	r.StaticFile("/avatar2.jpg", "dist/avatar2.jpg")

	// 解决页面刷新404的问题
	r.NoRoute(func(c *gin.Context) {
		if strings.Contains(c.Request.Header.Get("Accept"), "text/html") {
			if content, err := staticFS.ReadFile("dist/index.html"); err == nil {
				c.Header("Accept", "text/html")
				c.Data(http.StatusOK, "text/html; charset=utf-8", content)
				return
			}
		}
		c.Writer.WriteHeader(http.StatusNotFound)
		_, _ = c.Writer.WriteString("Not Found")
	})

	// 根路由
	r.GET("/", func(c *gin.Context) {
		if data, err := staticFS.ReadFile("dist/index.html"); err == nil {
			c.Data(http.StatusOK, "text/html; charset=utf-8", data)
		} else {
			_ = c.AbortWithError(http.StatusInternalServerError, err)
		}
	})

	// 错误处理
	r.Use(gin.Recovery())

	// 启动
	if err := r.Run(global.App.Config.App.ListenAddress); err != nil {
		fmt.Println("Failed to start server: ", err.Error())
	}
}

func main() {
	// 打印版本
	if version != "" {
		fmt.Println("goInsight Version：", version)
	}

	// 解析输入
	flag.Parse()

	// 初始化配置
	bootstrap.InitializeConfig(*ConfigFile)

	// 初始化日志
	bootstrap.InitializeLog()

	// 初始化数据库
	global.App.DB = bootstrap.InitializeDB()

	// 初始化Redis
	global.App.Redis = bootstrap.InitializeRedis()

	// 程序关闭前，释放数据库连接
	defer func() {
		if global.App.DB != nil {
			db, _ := global.App.DB.DB()
			db.Close()
		}
	}()

	// 初始化cron
	bootstrap.InitializeCron()

	// 启动服务器
	RunServer()
}
