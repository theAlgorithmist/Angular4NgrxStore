/**
 * Copyright 2017 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Calculator State for global store in ngrx/store - this version has been complicated a bit for purposes of
 * illustrating a store with two distinct slices (even though they are not quite orthogonal)
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { QInputs } from "./QInputs";
import { QMemory } from "./QMemory";

export interface CalcState
{
  inputs: QInputs;

  memory: QMemory;
}

import { ActionReducerMap } from '@ngrx/store';
import {inputReducer, memoryReducer} from "../reducers/quaternion.reducers";

export const quaternionCalcReducers: ActionReducerMap<CalcState> =
{
  inputs: inputReducer,
  memory: memoryReducer
};
