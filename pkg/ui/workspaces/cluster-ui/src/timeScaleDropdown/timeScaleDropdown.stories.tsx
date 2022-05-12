// Copyright 2022 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { TimeScaleDropdown } from "./timeScaleDropdown";
import { defaultTimeScaleSelected } from "./utils";

export function TimeScaleDropdownWrapper(): React.ReactElement {
  const [timeScale, setTimeScale] = useState(defaultTimeScaleSelected);
  return (
    <TimeScaleDropdown currentScale={timeScale} setTimeScale={setTimeScale} />
  );
}

storiesOf("TimeScaleDropdown", module).add("default", () => (
  <TimeScaleDropdownWrapper />
));
