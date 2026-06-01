import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import './App.css'

function App() {
  const cursorRef = useRef(null)
  const [hoveredButton, setHoveredButton] = useState(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touchLike = window.matchMedia('(hover: none), (pointer: coarse)').matches

    let rafId
    let lenis

    if (!reduceMotion) {
      lenis = new Lenis({ duration: 1.0, smoothWheel: true, smoothTouch: false })
      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    if (touchLike || !cursorRef.current) {
      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        if (lenis) lenis.destroy()
      }
    }

    document.documentElement.classList.add('has-custom-cursor')
    const cursor = cursorRef.current
    const state = { x: -100, y: -100, tx: -100, ty: -100, hover: false }
    const interactiveSel = "a, button, [role='button'], input, textarea, select, label, [tabindex]:not([tabindex='-1'])"

    const onMove = (e) => {
      state.tx = e.clientX
      state.ty = e.clientY
    }

    const onOver = (e) => {
      if (e.target.closest(interactiveSel)) state.hover = true
    }

    const onOut = (e) => {
      if (e.target.closest(interactiveSel)) state.hover = false
    }

    const tick = () => {
      state.x += (state.tx - state.x) * 0.24
      state.y += (state.ty - state.y) * 0.24
      const scale = state.hover ? 1.12 : 1
      const x = state.x - 22
      const y = state.y - 40
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      if (rafId) cancelAnimationFrame(rafId)
      if (lenis) lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const targets = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <main className="page">
        <section className="hero" aria-label="Koffi hero section">
          <div className="noise" aria-hidden="true"></div>
          <div className="hero-flow">
            <div className="hero-top">
              <div className="brand"><span className="brand-mark"></span> KOFFI</div>
              <button className="nav-cta">Explore Blends</button>
            </div>

            <div className="hero-main">
              <div className="hero-content">
                <div className="hero-copy-block">
                  <h1 className="hero-title"><span className="hero-title-line">Love for Koffi,</span><span className="hero-title-line">fear of <span className="word-small">small</span></span><span className="hero-title-line">places.</span></h1>
                  <p className="hero-copy">Great Koffi deserves room to breathe, and so do you. Discover blends crafted for comfort, calm, and a little escape in every sip.</p>
                </div>
                <div className="hero-actions">
                  <button
                    className={`btn btn-pink ${hoveredButton === 'shop' ? 'is-hovered' : ''}`}
                    onMouseEnter={() => setHoveredButton('shop')}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    Shop Our Koffi
                  </button>
                  <button
                    className={`btn btn-white ${hoveredButton === 'mug' ? 'is-hovered' : ''}`}
                    onMouseEnter={() => setHoveredButton('mug')}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    Make Your Mug Happy
                  </button>
                </div>
              </div>
              <div className="hero-art">
                <img src="/assets/koffi-img.png" alt="Illustration of person holding coffee" />
              </div>
            </div>
          </div>
        </section>

        <section className="body" aria-label="Why Koffi section" data-reveal>
          <div className="section-head" data-reveal>
            <div className="chip">// <img src="https://www.figma.com/api/mcp/asset/3e49da65-6bbc-4d12-b6c6-d515e5463c3c" width="14" height="14" alt="" /> Why Koffi Exists //</div>
            <h2>Coffee that gives you <span className="highlight">space to breathe</span></h2>
            <p>Because great flavour deserves room, and so do you.</p>
          </div>

          <div className="cards" data-reveal>
            <article className="card c1" data-reveal>
              <div>
                <h3>Crafted for Calm</h3>
                <p>Blends designed for people who want ritual without rush.</p>
              </div>
              <img className="icon" src="https://www.figma.com/api/mcp/asset/b65db87d-204b-42e9-9295-f8e63d82e124" alt="Heart hands icon" />
            </article>

            <article className="card c2" data-reveal>
              <img className="icon" src="https://www.figma.com/api/mcp/asset/847bee46-e00b-4561-b0d9-91bb0af7d5a7" alt="Clasped hands icon" />
              <div>
                <h3>Flavour Without the Fuss</h3>
                <p>Smooth, bold taste minus the noise and crowded cafe energy.</p>
              </div>
            </article>

            <article className="card c3" data-reveal>
              <div>
                <h3>Comfort in Every Cup</h3>
                <p>A soothing brew for all who prefer breathing room over bustle.</p>
              </div>
              <img className="icon" src="https://www.figma.com/api/mcp/asset/693aae1c-ff9c-43e6-b909-cacfafc9e069" alt="Waving hands icon" />
            </article>
          </div>
        </section>
      </main>

      <img ref={cursorRef} className="custom-cursor" id="customCursor" src="/assets/hand-cursor.svg" alt="" aria-hidden="true" />
    </>
  )
}

export default App
