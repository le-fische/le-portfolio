/**
 * The tuck box. Pure markup: every transform is driven by the Intro timeline,
 * which targets these class names. Faces are positioned on a 30px half-depth so
 * the cards (siblings in the same 3D context) depth-sort inside the box.
 */
export function TuckBox() {
  return (
    <div className="tuckbox relative h-72 w-52 [transform-style:preserve-3d]">
      {/* Front */}
      <div className="absolute inset-0 flex flex-col items-center rounded-md border border-white/15 bg-stage p-4 [transform:translateZ(30px)]">
        <h3 className="w-full border-b border-white/15 pb-2 text-center font-display text-2xl text-canvas">
          Houze
        </h3>
        <p className="label mt-2 text-canvas/40">Playing Cards</p>
        <div className="flex flex-1 items-center justify-center text-5xl text-accent">&#9824;</div>
        <p className="label text-canvas/40">Vancouver</p>
      </div>

      {/* Back */}
      <div className="absolute inset-0 overflow-hidden rounded-md border border-white/10 bg-stage [transform:translateZ(-30px)_rotateY(180deg)] [transform-style:preserve-3d]">
        <div className="absolute inset-0 opacity-50 [background:repeating-linear-gradient(45deg,transparent_0_10px,#242220_10px_11px)]" />
        <div className="absolute bottom-5 left-5 h-1.5 w-10 bg-canvas/70" />
        <div className="absolute top-5 right-5 h-1.5 w-8 bg-accent" />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-3xl font-bold tracking-[0.3em] text-canvas/20">
          XO
        </div>
        {/* Lower half of the tear seal: stays on the box when the lid lifts. */}
        <div className="absolute top-[30px] left-1/2 h-4 w-14 -translate-x-1/2 rounded-b-sm bg-accent [transform:translateZ(1px)]" />
      </div>

      {/* Sides and base */}
      <div className="absolute top-0 left-0 h-full w-[60px] origin-left bg-stage brightness-125 [transform:translateZ(30px)_rotateY(90deg)]" />
      <div className="absolute top-0 right-0 h-full w-[60px] origin-right bg-stage brightness-125 [transform:translateZ(30px)_rotateY(-90deg)]" />
      <div className="absolute bottom-0 left-0 h-[60px] w-full origin-bottom bg-stage [transform:translateZ(30px)_rotateX(90deg)]" />

      {/* Lid, hinged at the top edge.
          The lift is a literal colour, not `brightness-110`. `filter` is a
          grouping property: any value but `none` forces the used
          `transform-style` to flat, which would collapse the tab into the
          lid's plane and take the upper half of the seal with it. */}
      <div className="tuckbox-lid absolute top-0 left-0 flex h-[60px] w-full justify-center border-b border-white/10 bg-[#0c0b0a] [transform-style:preserve-3d]">
        {/* Tuck tab, folded out over the back face. Negative Z: the box meets
            the camera at rotationY -180, so the face nearest the viewer is the
            one at the most negative box-local Z. A positive offset here buries
            the tab behind the back panel. */}
        <div className="absolute top-[58px] h-[30px] w-1/2 origin-top rounded-b-3xl bg-[#0c0b0a] [transform:rotateX(90deg)_translateZ(-1px)] [transform-style:preserve-3d]">
          {/* Upper half of the tear seal */}
          <div className="absolute top-0 left-1/2 h-[30px] w-14 -translate-x-1/2 rounded-t-sm bg-accent [transform:translateZ(-1px)]" />
        </div>
      </div>
    </div>
  );
}
