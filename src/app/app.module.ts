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
 * App Module for the @ngrx/store quaterion calculator
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { BrowserModule           } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule              } from "@angular/http";
import { FormsModule             } from "@angular/forms";
import { NgModule                } from '@angular/core';

import { StoreModule } from '@ngrx/store';

import { MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule} from '@angular/material';

import {quaternionCalcReducers} from "./state/definitions/CalcState";

import { AppComponent        } from './app.component';
import { ServiceLayer        } from './services/ServiceLayer';
import { LoggingService      } from './services/Logging';
import { QuaternionComponent } from "./components/quaternion/quaternion.component";
import { ResultComponent     } from "./components/result/result.component";
import { MemoryComponent     } from "./components/memory/memory.component";

const PLATFORM_IMPORTS: any[] = [BrowserModule, HttpModule, FormsModule, BrowserAnimationsModule];

const MATERIAL_IMPORTS: any[] = [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule];

const APP_SERVICES: any[] = [ServiceLayer, LoggingService];

const APP_DECLARATIONS: any[] = [AppComponent, QuaternionComponent, ResultComponent, MemoryComponent];

@NgModule({
  declarations: APP_DECLARATIONS,
  imports: [
    PLATFORM_IMPORTS,
    MATERIAL_IMPORTS,
    StoreModule.forRoot(quaternionCalcReducers)
  ],
  providers: APP_SERVICES,
  bootstrap: [AppComponent]
})
export class AppModule { }
