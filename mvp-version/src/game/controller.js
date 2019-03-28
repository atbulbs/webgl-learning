import gameView from './view'
import gameModel from './model'

// controller暴露给业务使用者, 
// 关于UI的交给view处理, 关于data的交给model处理
// 组件通过callbacks通信
// view和model通过event相互触发驱动
class GameController {
  constructor () {
    this.gameView = gameView
    this.gameModel = gameModel
    this.gameModel.stageChanged.attach((sender, args) => {
      const stageName = args.stage
      switch (stageName) {
        case 'game-over':
          this.gameView.showGameOverPage()
          break
        case 'game':
          this.gameView.showGamePage()
          break
        default:
      }
    })
  }

  initPages () {
    const gamePageCallbacks = {
      showGameOverPage: () => {
        this.gameModel.setStage('game-over')
      }
    }
    const gameOverPagesCallbacks = {
      // 结束页重启游戏
      gameRestart: () => {
        this.gameModel.setStage('game')
      }
    }
    this.gameView.initGamePage(gamePageCallbacks)
    this.gameView.initGameOverPage(gameOverPagesCallbacks)
    this.gameModel.setStage('game')
  }
}

export default new GameController()