const MergedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 theme-background">
      {/* Grid Background Layer with Fade Out */}
      <div
        className="absolute inset-0 z-0 theme-background"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Grid Fade Out Mask */}
      <div
        className="absolute inset-0 z-5"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 30%, var(--theme-background) 100%)",
        }}
      />

      {/* Dark Horizon Glow Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, transparent 40%, var(--theme-background-secondary) 100%)",
        }}
      />
    </div>
  )
}

export default MergedBackground;
