# Quaternion Calculator with ngrx/store

Just when you thought it was safe to return to Github, the infamous _Quaterion Calculator_ makes another appearance, this time with the latest and greatest release of _@ngrx/store_ .  

This calculator is something I use as a _hello world_ project to evaluate new tools and frameworks.  I did release a version of the calculator using a 1.x release of _@ngrx/store_, but with a pre-release version of the Angular 2.x framework.  Although I liked the library, some subsequent issues with the growth of the library in tandem with Angular's pace of development caused me to move away in favor of a home-grown version of Flux/Redux.

I recently looked into the 4.x release and decided it was time to re-engage with this popular state-management tool.  So, once again, here is an updated version of the Quaternion Calculator with Angular 4, _@ngrx/store_, Material 2, and the Typescript Math Toolkit _Quaternion_ class.  Mmmmm ... tasty :)
 

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular: 4.4.6

Material: 2.0.0-beta.12

Typescript: 2.3.4

Angular CLI: 1.4.8

ngrx/store: 4.1.0

Version: 1.0

## Overview

This implementation of the quaternion calculator was expanded from prior versions to include the concept of initializing the calculator from a previously stored state.  The calculator still displays two quaternions whose individual inputs may be changed.  The expected operations of addition, subtraction, multiplication, and division are also provided.  A (non-interactive) result quaternion is used to display the result of the current operation.

As before, the result updates immediately if any element of either input quaternion changes.  A memory area is provided that can hold a single quaternion.  Either of the two input quaternions can be placed into memory and recalled from memory.  Memory recall causes the current operation to be updated and displayed in the result.

Here is an image of the calculator layout

![Quaternion Calculator](http://algorithmist.net/image/qc.png "Quaternion Calculator")

_Clear_ is supported as it has been from prior versions of the calculator and _Save_ is a new operation.

Before discussing the calculator implementation, I should mention that this is not a tutorial on _@ngrx/store_.  It will be helpful to have some introduction to the library, at least to the point of having written or deconstructed a _counter_ or _to-do list_ application


## Global Store

When I work on a Redux-style application, I tend to work on design of the store first, followed by reducers, and then the application seems to flow rather smoothly from those concepts.

So, what do we need to store in the calculator to support the desired functionality?

* Two input quaternions

* A result quaternion

* The current operation

* Current memory

* Current action (not absolutely necessary, but I like to have this info handy at all times)

If I were creating a production app, I would design a global store with five elements matching the above list.  Everything any component might need is immediately available after any update of the store.

But, that would not be fun, so let's suppose that an architect has decreed that memory will be an infrequently used operation.  Anticipated future modification include the ability to store more than one quaternion, perhaps even account for a history of stored and recalled quaternions from memory.  So, memory should be treated as a separate slice of the global store.

Again, from a personal basis, I like different slices of the store to be completely orthogonal, but for purposes of illustrating different features of _@ngrx/store_ and possible real-world considerations, let's go with it.

The store in the current application is partitioned into two slices, _QInput_ and _QMemory_.  Refer to the _definitions/CalcState.ts_ file,

```
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
```

Since calculator state may be stored and retrieved at application startup to initialize the calculator, we need a small model to support that operation.  We could argue that the result can be computed from the two inputs and an operation, so the working model is rather simple,

```
{
  "q1": [1, -1, 0, -1],
  "q2": [1, 2, 1, 0],
  "op": "[Calc] Add",
  "memory": []
}
```

A JSON structure with four properties suffices for the current application and the above example initializes the calculator with empty memory, two general quaternions, and an active operation of _addition_ .


## Reducers

One reducer is defined for each slice of the global store and then the entire store is presented to _@ngrx/store_ through _ActionReducerMap<CalcState>_ .  That information is passed to _@ngrx/store_ through the imports section in _app.module.ts_

```
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
``` 

In prior versions of the calculator, I allowed the root component to have sufficient _smarts_ to handle quaternion calculations.  These were performed using the Typescript Math Toolkit _Quaternion_ class.  This decision did make the application easier to write, but it could be argued that quaternion arithmetic is best handled in a reducer.  This allows downstream changes to be handled entirely in new reducers, which could easily be injected into an application without altering the application's structure.  For example, what if it is decided that the calculations should be in-lined in code without using a math library?

The current implementation offloads the task of quaternion computations to a reducer and the Typescript Math Toolkit is still used.  Since reducers should be pure functions without any side effects, the cleanest implementation of this approach involves creating and destroying _TSMT$Quaternion_ instances every time a reduction is performed that involves arithmetic.

An alternative is to employ a helper class with static members and methods.  This involves only one-time instantiation of _TSMT$Quaternion_ instances, which are conveniently isolated from any reducer.


## Running The Application

The calculator is initialized from data contained in the _assets/model.json_ file.  While the _SAVE_ operation is supported, no data is sent to a service.  Instead, the relevant data is packaged into JSON and you may view the console log to see the result.

The remainder of the calculator is open for your deconstruction and perhaps you can spot a few ways to improve the application, **including adding support for _OnPush_ change detection**.  In terms of an exercise, it would be valuable to modify the global store to have only a single slice.  At that point, you have been exposed to _@ngrx/store_ with two different models of the same application that involve a level of interactivity beyond that in a simple _counter_ or _to-do list_ application.

Note that there are no specs or e2e testing (add some if you feel so inclined) as applications such as this are best verified through direct interaction testing.  The _TSMT$Quaternion_ class has its own separate set of specs, but those are available only through the library, which has not yet been released to the public.

I hope you find something of value here and best of luck in your Angular and _@ngrx/store_ efforts!


## Further help

For more information on _@ngrx/store_, refer to [ngrx/store](https://github.com/ngrx/platform) .

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
