import React, { useEffect, useState } from "react";
import { Anchor } from "src/anchor";

interface ExpandableTextProps {
  text: string;
  characterLimit: number;
}

export function ExpandableText({
  text,
  characterLimit,
}: ExpandableTextProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [text]);

  if (text.length <= characterLimit) return <>{text}</>;

  return (
    <>
      {!isExpanded && (
        <>
          {text.slice(0, characterLimit) + "..."}{" "}
          <Anchor onClick={() => setIsExpanded(true)}>Show More</Anchor>
        </>
      )}
      {isExpanded && (
        <>
          {text} <Anchor onClick={() => setIsExpanded(false)}>Show Less</Anchor>
        </>
      )}
    </>
  );
}

export default ExpandableText;
