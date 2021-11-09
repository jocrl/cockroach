// Copyright 2021 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

// PartialRecursive provides the functionality of the Partial type but with the
// additional feature of the partial status being applied recursively to the
// object of the given type.
//
// This is particularly useful for the case in which a developer may want to
// define a nested slice of data which contains only partial subfields of the
// parent. This is not permitted by the Partial type wherein a developer must
// fully define all subfields of the partial field they defined.
//
// See for more information: https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
export type PartialRecursive<Slice> = {
  [Property in keyof Slice]?: Slice[Property] extends (infer Entity)[]
    ? PartialRecursive<Entity>[]
    : Slice[Property] extends object
    ? PartialRecursive<Slice[Property]>
    : Slice[Property];
};
