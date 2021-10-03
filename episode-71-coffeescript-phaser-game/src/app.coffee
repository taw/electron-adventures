get = (self, name, getter) ->
  Object.defineProperty self, name, {get: getter}

class StarEmitter
  constructor: (scene) ->
    @particles = scene.add.particles("star")
    @emitter = @particles.createEmitter
      gravityY: -50
      on: false
      lifespan: 2000
      speedX: {min: -50, max: 50}
      speedY: {min: -50, max: 50}
      alpha: 0.2
      rotate: {min: -1000, max: 1000}

  burst_at: (x, y) ->
    @emitter.emitParticle(40, x, y)

class Brick
  constructor: (scene, x, y) ->
    colors_by_row = {
      2: 0xFF0000
      3: 0xFF0080
      4: 0xFF00FF
      5: 0xFF80FF
      6: 0x8080FF
      7: 0x80FFFF
    }
    @destroyed = false
    @brick_x_size = size_x/18
    @brick_y_size = size_y/30
    @brick = scene.add.graphics()
    @brick.x = x*size_x/12
    @brick.y = y*size_y/20
    @brick.fillStyle(colors_by_row[y])
    @brick.fillRect(
      -@brick_x_size/2, -@brick_y_size/2,
      @brick_x_size, @brick_y_size
    )
    get @, "x",-> @brick.x
    get @, "y",-> @brick.y

  destroy: ->
    @brick.destroy()
    @destroyed = true

class Ball
  constructor: (scene) ->
    @ball = scene.add.graphics()
    @ball.x = 0.5*size_x
    @ball.y = 0.8*size_y
    @ball.fillStyle(0x000000)
    @ball.fillRect(-10,-10,20,20)
    @dx = 300
    @dy = -300
    get @, "x", -> @ball.x
    get @, "y", -> @ball.y

  update: (dt) ->
    @ball.x += @dx*dt
    @ball.y += @dy*dt
    if @ball.x <= 10 && @dx < 0
      @dx = - @dx
    if @ball.x >= size_x-10 && @dx > 0
      @dx = - @dx
    if @ball.y <= 10 && @dy < 0
      @dy = - @dy

class Paddle
  constructor: (scene) ->
    @paddle = scene.add.graphics()
    @paddle.x = 0.5*size_x
    @paddle.y = size_y-20
    @paddle.fillStyle(0x0000FF)
    @paddle.fillRect(-50, -10, 100, 20)
    get @, "x", -> @paddle.x

  update: (dt, direction) ->
    @paddle.x += dt * direction * 500
    @paddle.x = Phaser.Math.Clamp(@paddle.x, 55, size_x-55)

class MainScene extends Phaser.Scene
  preload: () ->
    @load.image("star", "star.png")
    @load.audio("coin", "coin.mp3")

  create: () ->
    @active = true
    @paddle = new Paddle(@)
    @ball = new Ball(@)
    @bricks = []
    for x from [1..11]
      for y from [2..7]
        @bricks.push(new Brick(@, x, y))
    @emitter = new StarEmitter(@)
    @coin = @sound.add("coin")
    @coin.volume = 0.2

  handle_brick_colission: (brick) ->
    return if brick.destroyed
    distance_x = Math.abs((brick.x - @ball.x) / (10 + brick.brick_x_size/2))
    distance_y = Math.abs((brick.y - @ball.y) / (10 + brick.brick_y_size/2))
    if distance_x <= 1.0 && distance_y <= 1.0
      brick.destroy()
      @emitter.burst_at(@ball.x, @ball.y)
      @coin.play()
      if distance_x < distance_y
        @ball_bounce_y = true
      else
        @ball_bounce_x = true

  is_game_won: () ->
    @bricks.every((b) => b.destroyed)

  update: (_, dts) ->
    return unless @active
    dt = dts / 1000.0
    @ball.update(dt)
    if @input.keyboard.addKey("RIGHT").isDown
      @paddle.update(dt, 1)
    else if @input.keyboard.addKey("LEFT").isDown
      @paddle.update(dt, -1)
    @ball_bounce_x = false
    @ball_bounce_y = false
    for brick from @bricks
      @handle_brick_colission(brick)
    @ball.dx = -@ball.dx if @ball_bounce_x
    @ball.dy = -@ball.dy if @ball_bounce_y

    paddle_distance = Math.abs(@paddle.x - @ball.x)
    bottom_distance = size_y - @ball.y

    if @ball.dy > 0
      if bottom_distance <= 30 && paddle_distance <= 60
        @ball.dy = -300
        @ball.dx = 7 * (@ball.x - @paddle.x)
      else if bottom_distance <= 10 && paddle_distance >= 60
        @cameras.main.setBackgroundColor("#FAA")
        @active = false
    if @is_game_won()
      @cameras.main.setBackgroundColor("#FFF")
      @active = false

size_x = 800
size_y = 600
game = new Phaser.Game
  backgroundColor: "#AAF"
  width: size_x
  height: size_y
  scene: MainScene
