import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaternionComponent } from './quaternion.component';

describe('QuaternionComponent', () => {
  let component: QuaternionComponent;
  let fixture: ComponentFixture<QuaternionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuaternionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuaternionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
