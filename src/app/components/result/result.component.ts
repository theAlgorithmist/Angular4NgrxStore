/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * Display the result quaternion
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Component
       , OnInit
       , OnDestroy
} from '@angular/core';

import { Store } from "@ngrx/store";

import { QInputs } from "../../state/definitions/QInputs";
import { Q       } from "../../state/definitions/Q";

import { CalcState } from "../../state/definitions/CalcState";
import * as CalcActions from '../../state/actions/CalcActions';

// RxJS
import { Observable   } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-result',

  templateUrl: './result.component.html',

  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy
{
  // quaternion values
  public w: number = 0;             // real component
  public i: number = 0;             // i-component
  public j: number = 0;             // j-component
  public k: number = 0;             // k-component

  // NGRX/Store
  protected _inputs: Observable<QInputs>;         // input section of State
  protected _inputsSub: Subscription;

  constructor(protected _store: Store<CalcState>)
  {
    // the usual suspects ...
    this._inputs = this._store.select('inputs');

    this._inputsSub = this._inputs.subscribe( (input: QInputs ) => this.__onInputs(input)  );
  }

  /**
   * Angular lifecycle method - on init
   *
   * @returns {nothing}
   */
  public ngOnInit(): void
  {
    // reserved for future use
  }

  /**
   * Angular lifecycle method - on destroy
   *
   * @returns {nothing}
   */
  public ngOnDestroy(): void
  {
    this._inputsSub.unsubscribe();
  }

  // execute whenever inputs change
  protected __onInputs(input: QInputs): void
  {
    if (input !== undefined && input != null)
    {
      if (input.action != CalcActions.Q_NONE)
      {
        let q: Q = input.result;

        [this.w, this.i, this.j, this.k] = [q.w, q.i, q.j, q.k];
      }
    }
  }
}
