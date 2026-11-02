import type { CSSProperties, ElementType, ComponentPropsWithoutRef } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Stagger position inside a group; becomes --reveal-index. */
  index?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "index">;

// Scroll-reveal wrapper. RevealObserver flips data-reveal to "pending"/"shown" on the client before
// below-the-fold sections hydrate, so the attribute is expected to differ from the server HTML.
export default function Reveal<T extends ElementType = "div">({
  as,
  index,
  style,
  ...props
}: RevealProps<T>) {
  const Tag: ElementType = as ?? "div";
  const mergedStyle =
    index === undefined
      ? style
      : ({ ...style, "--reveal-index": index } as CSSProperties);
  return <Tag data-reveal="" suppressHydrationWarning style={mergedStyle} {...props} />;
}
