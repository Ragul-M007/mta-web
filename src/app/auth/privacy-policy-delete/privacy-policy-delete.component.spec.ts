import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyDeleteComponent } from './privacy-policy-delete.component';

describe('PrivacyPolicyDeleteComponent', () => {
  let component: PrivacyPolicyDeleteComponent;
  let fixture: ComponentFixture<PrivacyPolicyDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
