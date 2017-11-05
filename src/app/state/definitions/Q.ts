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
 * A Quaternion value holder, named after an infamous Star Trek TNG character
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
export class Q
{
  public id: string  = '';
  private _w: number = 0;
  private _i: number = 0;
  private _j: number = 0;
  private _k: number = 0;

  /**
   * Construct a new Q
   *
   * @param {number} wValue Real part of the quaternion
   *
   * @param {number} iValue i-component of the quaternion
   *
   * @param {number} jValue j-component of the quaternion
   *
   * @param {number} kValue k-component of the quaternion
   *
   * @param {string} _id (optional) id associated with these values
   */
  constructor (wValue: number, iValue: number, jValue: number, kValue: number, _id?: string)
  {
    this.w = wValue;
    this.i = iValue;
    this.j = jValue;
    this.k = kValue;

    if (_id !== undefined) {
      this.id = _id;
    }
  }

  public get w(): number { return this._w; }
  public get i(): number { return this._i; }
  public get j(): number { return this._j; }
  public get k(): number { return this._k; }

  /**
   * Assign the w-value
   *
   * @param {number} value
   *
   * @returns {nothing}
   */
  public set w(value: number)
  {
    if (!isNaN(value) && isFinite(value)) {
      this._w = value;
    }
  }

  /**
   * Assign the i-value
   *
   * @param {number} value
   *
   * @returns {nothing}
   */
  public set i(value: number)
  {
    if (!isNaN(value) && isFinite(value)) {
      this._i = value;
    }
  }

  /**
   * Assign the k-value
   *
   * @param {number} value
   *
   * @returns {nothing}
   */
  public set j(value: number)
  {
    if (!isNaN(value) && isFinite(value)) {
      this._j = value;
    }
  }

  /**
   * Assign the k-value
   *
   * @param {number} value
   *
   * @returns {nothing}
   */
  public set k(value: number)
  {
    if (!isNaN(value) && isFinite(value)) {
      this._k = value;
    }
  }

  /**
   * Clone this holder
   *
   * @returns {Q} Copy of current quaternion values holder
   */
  public clone(): Q
  {
    return new Q(this._w, this._i, this._j, this._k, this.id);
  }
}
