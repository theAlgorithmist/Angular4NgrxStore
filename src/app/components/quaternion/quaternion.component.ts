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
 * A single quaternion that may be used interactively or for display only
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Component
       , OnInit
       , OnDestroy
       , Input
       , Output
       , EventEmitter
} from '@angular/core';

// state/etc
import { Store } from "@ngrx/store";

import { QInputs } from "../../state/definitions/QInputs";
import { Q       } from "../../state/definitions/Q";

import { QMemory   } from "../../state/definitions/QMemory";
import { CalcState } from "../../state/definitions/CalcState";
import * as CalcActions from '../../state/actions/CalcActions';

// RxJS
import { Observable   } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

// utils
import { NumberValidator } from "../../NumberValidator";

@Component({
  selector: 'app-quaternion',

  templateUrl: './quaternion.component.html',

  styleUrls: ['./quaternion.component.scss']
})
export class QuaternionComponent implements OnInit, OnDestroy
{
  // NGRX/Store
  protected _inputs: Observable<QInputs>;         // input section of State
  protected _memory: Observable<QMemory>;         // memory section of State
  protected _inputSub: Subscription;
  protected _memorySub: Subscription;

  /**
   * ID for this quaternion which should be 'q1' or 'q2' for this application
   *
   * @type {string}
   */
  @Input() id: string = '';         // this should be 'q1' or 'q2'

  /**
   * quaternion values change due to user input
   *
   * @type{Q}
   */
  @Output('qChanged') _change: EventEmitter<Q> = new EventEmitter<Q>();

  // quaternion values
  public w: number = 0;             // real component
  public i: number = 0;             // i-component
  public j: number = 0;             // j-component
  public k: number = 0;             // k-component

  constructor(protected _store: Store<CalcState>)
  {
    this._inputs = this._store.select('inputs');
    this._memory = this._store.select('memory');

    this._inputSub  = this._inputs.subscribe( (input: QInputs ) => this.__onInputs(input)  );
    this._memorySub = this._memory.subscribe( (memory: QMemory) => this.__onMemory(memory) );

    this._change = new EventEmitter<Q>();
  }

  /**
   * Angular lifecycle handler - on init
   *
   * @returns {nothing}
   */
  public ngOnInit(): void
  {
    // reserved for future use
  }

  /**
   * Angular lifecycle handler - on destroy
   *
   * @returns {nothing}
   */
  public ngOnDestroy(): void
  {
    this._inputSub.unsubscribe();
    this._memorySub.unsubscribe();
  }

  /**
   * A quaternion value has changed
   *
   * @returns {nothing} Emits 'qChanged' event
   */
  public onChanged(): void
  {
    this._change.emit( new Q(this.w, this.i, this.j, this.k, this.id) );
  }

  /** @internal */
  public __checkNumber(evt: any): boolean
  {
    return NumberValidator.validate(evt);
  }

  // input state was updated
  protected __onInputs(input: QInputs): void
  {
    if (input)
    {
      // this is not necessary, but shows how to isolate the update process to a specific action, i.e. we don't need
      // to update the quaternion display every time an operation is performed, even though it is rather trivial
      if (input.action == CalcActions.INIT || input.action == CalcActions.Q_CLEAR)
      {
        let q: Q = this.id == 'q1' ? input.q1 : input.q2;

        [this.w, this.i, this.j, this.k] = [q.w, q.i, q.j, q.k];
      }
    }
  }

  // quaternion memory operation
  protected __onMemory(m: QMemory): void
  {
    if (m !== undefined && m != null)
    {
      // only update inputs if the action is from-memory as this same method will be executed on a to-memory action
      if (m.action == CalcActions.FROM_MEMORY)
      {
        // only update comparable id's
        if ((m.id == "Q_1" && this.id == 'q1') ||
            (m.id == "Q_2" && this.id == 'q2'))
        {
          let q: Q = m.memory;
          [this.w, this.i, this.j, this.k] = [q.w, q.i, q.j, q.k];
        }
      }
    }
  }
}
