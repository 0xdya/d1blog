
function TocItems({ items }) {
  return (
    <ul className="toc-list">
      {items.map((item) => (
        <li key={item.id} className={`toc-item toc-level-${item.level}`}>
          {item.children.length > 0 ? (
            <details open>
              <summary>
                <a href={`#${item.id}`}>{item.text}</a>
              </summary>
              <TocItems items={item.children} />
            </details>
          ) : (
            <a href={`#${item.id}`}>{item.text}</a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function TableOfContents({ items }) {
  if (!items.length) return null;

  return (
    <nav className="table-of-contents" aria-label="فهرس المقال">
      <h2> الفهرس</h2>
      <TocItems items={items} />
    </nav>
  );
}