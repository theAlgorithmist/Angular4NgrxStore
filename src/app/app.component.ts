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
 * Root component of the quaternion calculator.  This version illustrates partitioning the global store into 'inputs' and
 * 'memory' slices.  While showing some more advanced features of Ngrx/store, I would not do this in the same application
 * if it were production.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Component
       , OnInit
       , OnDestroy
       , ViewChild
} from '@angular/core';

import { Store } from "@ngrx/store";

import { ServiceLayer } from "./services/ServiceLayer";

import { QInputs } from "./state/definitions/QInputs";
import { Q       } from "./state/definitions/Q";

import { QMemory   } from "./state/definitions/QMemory";
import { CalcState } from "./state/definitions/CalcState";
import * as CalcActions from './state/actions/CalcActions';

import { Observable          } from 'rxjs/Observable';
import { Subscription        } from "rxjs/Subscription";
import { QuaternionComponent } from "./components/quaternion/quaternion.component";
import { ResultComponent     } from "./components/result/result.component";

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',

  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
  // NGRX/Store
  protected _inputs: Observable<QInputs>;         // input section of State
  protected _memory: Observable<QMemory>;         // memory section of State
  protected _storeSub: Subscription;
  protected _inputSub: Subscription;
  protected _memorySub: Subscription;

  // view children
  @ViewChild('q1') _q1: QuaternionComponent;      // first input (display) quaternion
  @ViewChild('q2') _q2: QuaternionComponent;      // second input (display) quaternion
  @ViewChild('result') _result: ResultComponent;  // Result (display) quaternion

  protected _op: string = 'none';                 // current operation

  protected _save: boolean = false;

  // cache these locally as helpers in memory operations
  protected _quat1: Q;
  protected _quat2: Q;

  constructor(protected _service: ServiceLayer,
              protected _store: Store<CalcState>)
  {
    this._inputs = _store.select('inputs');
    this._memory = _store.select('memory');

    this._storeSub  = this._store.subscribe( (state: CalcState) => this.__onStore(state) );
    this._inputSub  = this._inputs.subscribe( (input: QInputs ) => this.__onInputs(input)  );
    this._memorySub = this._memory.subscribe( (memory: QMemory) => this.__onMemory(memory) );
  }

  /**
   * Access the current operation
   *
   * @returns {string} Indication of add/subtract/multiply/divide
   */
  public get operation(): string
  {
    return this._op;
  }

  /**
   * Angular lifecycle method - on init
   *
   * @returns {nothing}
   */
  public ngOnInit(): void
  {
    // simulate the process of loading previous calculator state from a server
    this._service.getData('./assets/model.json').subscribe( (data: Response) => this.__onModelLoaded(data) );
  }

  /**
   * Angular lifecycle method - on destroy
   *
   * @returns {nothing}
   */
  public ngOnDestroy(): void
  {
    this._storeSub.unsubscribe();
    this._inputSub.unsubscribe();
    this._memorySub.unsubscribe();
  }

  /**
   * User clicks on 'add' operation in the calculator
   *
   * @returns {nothing}
   */
  public onAdd(): void
  {
    this._op = 'add';

    this._store.dispatch( {type: CalcActions.Q_ADD} );
  }

  /**
   * User clicks on 'subtract' operation in the calculator
   *
   * @returns {nothing}
   */
  public onSubtract(): void
  {
    this._op = 'sub';

    this._store.dispatch( {type: CalcActions.Q_SUBTRACT} );
  }

  /**
   * User clicks on 'multiply' operation in the calculator
   *
   * @returns {nothing}
   */
  public onMultiply(): void
  {
    this._op = 'mul';

    this._store.dispatch( {type: CalcActions.Q_MULTIPLY} );
  }

  /**
   * User clicks on 'divide' operation in the calculator
   *
   * @returns {nothing}
   */
  public onDivide(): void
  {
    this._op = 'div';

    this._store.dispatch( {type: CalcActions.Q_DIVIDE} );
  }

  /**
   * One of the calculator quatertions has changed
   *
   * @param {Q} q Changed quaternion
   */
  public onQuaternionChanged(q: Q): void
  {
    // update the result based on the current operation - to make this more compact, change the internal _op var.
    // to match the calculator actions, then add a toLabel() method to convert the action to a convenient label to
    // display in the UI

    const qi: QInputs = new QInputs();
    qi.q1             = q.id == "q1" ? q : this._quat1;
    qi.q2             = q.id == "q2" ? q : this._quat2;

    this.__update(qi);
  }

  /**
   * User clicks on 'clear' button in calculator
   *
   * @returns {nothing}
   */
  public onClear(): void
  {
    this._store.dispatch( {type: CalcActions.Q_CLEAR} );
  }

  /**
   * User clicks on 'save' button in the calculator
   *
   * @returns {nothing}
   */
  public onSave(): void
  {
    this._save = true;

    this._store.dispatch( {type: CalcActions.STORE} );
  }

  /**
   * User clicks on one of the 'to memory' buttons to place either Q1 or Q2 into memory
   *
   * @param {string} id Id of the quaternion to be placed into memory
   *
   * @returns {nothing}
   */
  public onToMemory(id: string): void
  {
    // grab the appropriate quaternion from local cache
    let q: Q = id == "Q_1" ? this._quat1 : this._quat2;

    // dispatch to-memory with the whole nine yards of payload :)
    this._store.dispatch( {type: CalcActions.TO_MEMORY, payload:{action: CalcActions.TO_MEMORY, id: id, memory: q}} );
  }

  /**
   * User clicks on one of the 'from memory' buttons to return a quaternion from memory
   *
   * @param {string} id Id of the quaternion to fill from memory
   *
   * @returns {nothing}
   */
  public onFromMemory(id: string): void
  {
    this._store.dispatch( {type: CalcActions.FROM_MEMORY} );
  }

  // execute whenever the external model is located
  protected __onModelLoaded(response: Response): void
  {
    const data: Object = response.json();

    const qi: QInputs = new QInputs();

    const q1Arr: Array<number> = data['q1'];
    const q2Arr: Array<number> = data['q2'];
    const mem: Array<number>   = data['memory'];

    // result can be computed from inputs, so there is no need to store it
    qi.q1 = new Q(q1Arr[0], q1Arr[1], q1Arr[2], q1Arr[3]);
    qi.q2 = new Q(q2Arr[0], q2Arr[1], q2Arr[3], q2Arr[4]);
    qi.op = data['op'];

    this._op = this.__opToString(qi.op);

    // update the store
    this._store.dispatch( {type: CalcActions.INIT, payload: qi} );

    // there may not be anything placed in memory
    if (mem.length > 0)
    {
      const memory: Q = new Q(mem[0], mem[1], mem[2], mem[3]);

      this._store.dispatch({type: CalcActions.TO_MEMORY, payload: memory});
    }
  }

  // execute whenever the inputs section of the global store is updated
  protected __onInputs(data: QInputs): void
  {
    if (data && data.q1 && data.q2)
    {
      this._quat1 = data.q1.clone();
      this._quat2 = data.q2.clone();
    }
  }

  // execute whenever the memory section of the global store is updated
  protected __onMemory(data: QMemory): void
  {
    // if the action is from-memory, we need to update the current operation
    if (data && data.action == CalcActions.FROM_MEMORY)
    {
      const qi: QInputs = new QInputs();
      qi.q1             = data.id == "Q_1" ? data.memory : this._quat1;
      qi.q2             = data.id == "Q_2" ? data.memory : this._quat2;

      this.__update(qi);
    }
  }

  protected __update(qi: QInputs): void
  {
    switch (this._op)
    {
      case 'add':
        this._store.dispatch( {type: CalcActions.Q_ADD, payload: qi} );
      break;

      case 'sub':
        this._store.dispatch( {type: CalcActions.Q_SUBTRACT, payload: qi} );
      break;

      case 'mul':
        this._store.dispatch( {type: CalcActions.Q_MULTIPLY, payload: qi} );
      break;

      case 'div':
        this._store.dispatch( {type: CalcActions.Q_DIVIDE, payload: qi} );
      break;
    }
  }

  protected __onStore(state: CalcState)
  {
    if (this._save)
    {
      // package the store to send to a service
      let qi: QInputs = state.inputs;
      let qm: QMemory = state.memory;

      let store: Object = {
        q1: qi.q1,
        q2: qi.q2,
        op: qi.op,
        memory: qm ? qm.memory : []
      };

      console.log( 'ready so save calculator model:', store );
    }
  }

  protected __opToString(op: string): string
  {
    switch (op)
    {
      case CalcActions.Q_ADD:
        return 'add';

      case CalcActions.Q_SUBTRACT:
        return 'sub';

      case CalcActions.Q_MULTIPLY:
        return 'mul';

      case CalcActions.Q_DIVIDE:
        return 'div';

      default:
        return 'none';
    }
  }
}
