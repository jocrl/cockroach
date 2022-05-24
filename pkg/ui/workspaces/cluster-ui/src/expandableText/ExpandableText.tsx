import React, { useState } from "react";
interface ExpandableTextProps {
  text: string;
  characterLimit: number;
}

export function ExpandableText({
  text,
  characterLimit,
}: ExpandableTextProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= characterLimit) return <>{text}</>;

  return (
    <>
      {!isExpanded && (
        <>
          {text.slice(0, characterLimit) + "..."}{" "}
          <a onClick={() => setIsExpanded(true)}>Show More</a>
        </>
      )}
      {isExpanded && (
        <>
          {text} <a onClick={() => setIsExpanded(false)}>Show Less</a>
        </>
      )}
    </>
  );
}
