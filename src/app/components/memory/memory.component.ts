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
 * Memory bar component
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */
import { Component
       , OnInit
       , Input
       , Output
       , EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-memory',

  templateUrl: './memory.component.html',

  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit
{
  /**
   * Id for this memory bar (Q_1 or Q_2, for example)
   *
   * @type {string}
   */
  @Input('') id: string = '';

  /**
   * Indicate a 'to-memory' operation
   *
   * @type {string}
   */
  @Output('memTo'  ) _to: EventEmitter<string>;

  /**
   * Indicate a 'from-memory' operation
   *
   * @type {string}
   */
  @Output('memFrom') _from: EventEmitter<string>;

  constructor()
  {
    this._to   = new EventEmitter<string>();
    this._from = new EventEmitter<string>();
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

  // handle to- and from-memory button clicks

  /** @internal */
  public __onMemoryAdd() :void
  {
    this._to.emit(this.id);
  }

  /** @internal */
  public __onMemoryRecall(): void
  {
    this._from.emit(this.id);
  }
}
