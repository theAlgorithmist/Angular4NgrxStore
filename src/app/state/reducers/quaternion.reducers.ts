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
 * Reducers for the quaternion calculator
 *
 * @author Jim Armtrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import * as CalcActions from '../actions/CalcActions';

import { Q       } from "../definitions/Q";
import { QInputs } from "../definitions/QInputs";
import { QCalc   } from "../../libs/QCalc";
import { QMemory } from "../definitions/QMemory";

export interface QMemoryAction
{
  type: string;

  payload: QMemory;
}

/**
 * Model for input actions
 */
export interface QInputAction
{
  type: string

  payload: QInputs;
}

/**
 * Reduce QInputs section of global store
 *
 * @param {QInputs} state Prior state
 *
 * @param {QInputAction} action QInput action
 *
 * @returns {QInputs} Updated QInputs slice of the store
 */
export function inputReducer(state: QInputs, action: QInputAction): QInputs
{
  const qi: QInputs = new QInputs();

  // priority is payload, then state
  if (action.payload)
  {
    qi.q1 = action.payload.q1;
    qi.q2 = action.payload.q2;
    qi.op = action.payload.op;
  }
  else
  {
    qi.q1 = state ? state.q1.clone() : new Q(1, 0, 0, 0);
    qi.q2 = state ? state.q2.clone() : new Q(1, 0, 0, 0);
    qi.op = state ? state.op : CalcActions.Q_NONE;
  }

  qi.action = action.type;

  switch(action.type)
  {
    case CalcActions.Q_ADD:
      qi.result = QCalc.add(qi.q1, qi.q2);
      return qi;

    case CalcActions.Q_SUBTRACT:
      qi.result = QCalc.subtract(qi.q1, qi.q2);
      return qi;

    case CalcActions.Q_MULTIPLY:
      qi.result = QCalc.multiply(qi.q1, qi.q2);
      return qi;

    case CalcActions.Q_DIVIDE:
      qi.result = QCalc.divide(qi.q1, qi.q2);
      return qi;

    case CalcActions.Q_CLEAR:
      qi.op     = CalcActions.Q_NONE;
      qi.q1     = new Q(1, 0, 0, 0);
      qi.q2     = new Q(1, 0, 0, 0);
      qi.result = new Q(1, 0, 0, 0);
      return qi;

    case CalcActions.INIT:
      let q: QInputs = action.payload.clone();
      q.action = action.type;

      // is there an operation to be performed on init?
      switch (q.op)
      {
        case CalcActions.Q_ADD:
          q.result = QCalc.add(q.q1, q.q2);
        break;

        case CalcActions.Q_SUBTRACT:
          q.result = QCalc.subtract(q.q1, q.q2);
        break;

        case CalcActions.Q_MULTIPLY:
          q.result = QCalc.multiply(q.q1, q.q2);
        break;

        case CalcActions.Q_DIVIDE:
          q.result = QCalc.divide(q.q1, q.q2);
        break;
      }

      return q;

    default:
      return qi;
  }
}

/**
 * Reduce QMemory section of global store
 *
 * @param {QInputs} state Prior state
 *
 * @param {QInputAction} action QInput action
 *
 * @returns {QInputs} Updated QMemory slice of the store
 */
export function memoryReducer(state: QMemory, action: QMemoryAction): QMemory
{
  switch(action.type)
  {
    case CalcActions.TO_MEMORY:
      return {action: action.type, id: action.payload.id, memory: action.payload.memory};

    case CalcActions.FROM_MEMORY:
      return {action: CalcActions.FROM_MEMORY, id: state.id, memory: state.memory};

    default:
      return state;
  }
}
