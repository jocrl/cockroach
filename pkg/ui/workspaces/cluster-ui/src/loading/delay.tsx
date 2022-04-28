// Copyright 2022 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import moment from "moment";
import React, { useState, useEffect } from "react";

interface Props {
  children: React.ReactElement;
  delay?: moment.Duration;
}

const Delayed = ({
  children,
  delay = moment.duration(500, "m"),
}: Props): React.ReactElement => {
  const delayMilliseconds = delay.asMilliseconds();
  const [isShown, setIsShown] = useState(false);
  console.log("showing", isShown);
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("show true");
      setIsShown(true);
    }, delayMilliseconds);
    return () => clearTimeout(timer);
  }, [delayMilliseconds]);

  return isShown ? children : null;
};

export default Delayed;
