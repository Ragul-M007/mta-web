import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordianPageComponent } from './accordian-page.component';

describe('AccordianPageComponent', () => {
  let component: AccordianPageComponent;
  let fixture: ComponentFixture<AccordianPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordianPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordianPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
