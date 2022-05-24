// Copyright 2021 The Cockroach Authors.
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

import { SortedTable, SortedTableProps, SortSetting } from "./";

const columns = [
  {
    name: "col1",
    title: "Col 1",
    cell: (idx: number) => `Col 1: row-${idx}`,
    sort: (idx: number) => idx,
  },
  {
    name: "col2",
    title: "Col 2",
    cell: (idx: number) => `Col 2: row-${idx}`,
    sort: (idx: number) => idx,
  },
  {
    name: "col3",
    title: "Col 3",
    cell: (idx: number) => `Col 3: row-${idx}`,
    sort: (idx: number) => idx,
  },
];

const data = [1, 2, 3];

export function SortedTableWrapper({
  // We pull out onChangeSortSetting so that they will not be passed.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeSortSetting,
  ...props
}: Partial<SortedTableProps<number>>): React.ReactElement {
  const [statefulSortSetting, setSortSetting] = useState<SortSetting>(
    props.sortSetting && {
      ascending: true,
      columnTitle: "col1",
    },
  );

  return (
    <SortedTable
      sortSetting={statefulSortSetting}
      onChangeSortSetting={setSortSetting}
      {...props}
    />
  );
}

storiesOf("Sorted table", module)
  .add("Empty state", () => <SortedTable empty />)
  .add("No sort", () => {
    return <SortedTable columns={columns} data={data} />;
  })
  .add("With sort", () => <SortedTableWrapper columns={columns} data={data} />)
  // This story was added upon noticing that the table had this functionality, and that this functionality was tested
  // It doesn't appear to be used.
  .add("Expandable", () => (
    <SortedTableWrapper
      columns={columns}
      data={data}
      expandableConfig={{
        expandedContent: testRow => (
          <div>
            {testRow}={testRow}
          </div>
        ),
        expansionKey: testRow => testRow.toString(),
      }}
    />
  ));
