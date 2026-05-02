import { Outlet } from 'react-router-dom'

export default function TabletFrame({ children }) {
  const tabletImageSrc = `${import.meta.env.BASE_URL}images/tablet.png`

  return (
    <div className="tablet-frame-shell">
      <div className="tablet-frame-stage">
        <div className="tablet-frame-viewport">
          {children ?? <Outlet />}
        </div>
        <img
          src={tabletImageSrc}
          alt=""
          aria-hidden="true"
          className="tablet-frame-image"
          draggable="false"
        />
      </div>
    </div>
  )
}
