import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemeetingroomComponent } from './createmeetingroom.component';

describe('CreatemeetingroomComponent', () => {
  let component: CreatemeetingroomComponent;
  let fixture: ComponentFixture<CreatemeetingroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatemeetingroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatemeetingroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
