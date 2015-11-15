import Timer from './Timer'
let clock

describe('Timer', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers(1000*60*60)
  })
  afterEach(() => {
    Timer.stop()
    clock.restore()
  })

  describe('behaviour', () => {
    it('#start', () => {
      expect( Timer.start(25*60) ).to.be.ok

      expect( Timer.start("123.2") ).not.to.be.ok
      expect( Timer.start("123") ).not.to.be.ok
      expect( Timer.start([]) ).not.to.be.ok
      expect( Timer.start(123.2) ).not.to.be.ok
      expect( Timer.start(-1) ).not.to.be.ok
      expect( Timer.start(0) ).not.to.be.ok
    })

    it('#isInProgress', () => {
      Timer.start(25*60)
      expect( Timer.isInProgress() ).to.be.true
      Timer.stop()
      expect( Timer.isInProgress() ).to.be.false
    })

    it('#start when in progress is not allowed', () => {
      Timer.start(25*60)
      expect( Timer.start(25*60) ).not.to.be.ok
    })

    it('#stop', () => {
      Timer.start(25*60)
      expect( Timer.stop() ).to.eql( 0 )
    })

    it('#getRemaining', () => {
      expect( Timer.start(25*60) ).to.be.ok
      clock.tick(1000)
      expect( Timer.getRemaining() ).to.eql( 25*60 -1 )
    })
  })

  describe('events', () => {
    const callback = sinon.spy()
    afterEach(() => {
      callback.reset()
      Timer.off('tick', callback)
      Timer.off('end', callback)
      Timer.off('start', callback)
    })
    it('#on "tick"', () => {
      Timer.on('tick', callback)
      Timer.start(25*60)
      expect( callback.called ).to.be.true
    })

    it('#on "start"', () => {
      Timer.on('start', callback)
      Timer.start(25*60)
      expect( callback.called ).to.be.true
      expect( callback.calledWith(25*60) ).to.be.true
    })

    it('#on "tick" stops when timer is stopped', () => {
      Timer.on('tick', callback)
      Timer.start(25*60)
      callback.reset()
      Timer.stop()
      clock.tick(1000)
      expect( callback.called ).not.to.be.true
    })

    it('#off "tick"', () => {
      Timer.on('tick', callback)
      Timer.start(25*60)
      callback.reset()
      Timer.off('tick', callback)
      clock.tick(1000)
      expect( callback.called ).not.to.be.true
    })

    it('#on "end"', () => {
      Timer.on('end', callback)
      Timer.start(1)
      expect( callback.called ).not.to.be.true
      clock.tick(1000)
      expect( callback.called ).to.be.true
    })
  })
})
