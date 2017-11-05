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
 * Model QInputs section of the global store
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Q } from "./Q";

export class QInputs
{
  public q1: Q;
  public q2: Q;
  public result: Q;
  public op: string;
  public action: string;

  constructor()
  {
    this.q1     = new Q(0, 0, 0, 0);
    this.q2     = new Q(0, 0, 0, 0);
    this.result = new Q(0, 0, 0, 0);
    this.op     = 'none';
    this.action = 'none';
  }

  /**
   * Clone this container
   *
   * @returns {QInputs}
   */
  public clone(): QInputs
  {
    const q: QInputs = new QInputs();

    q.q1     = this.q1.clone();
    q.q2     = this.q2.clone();
    q.result = this.result.clone();
    q.op     = this.op;
    q.action = this.action;

    return q;
  }
}
