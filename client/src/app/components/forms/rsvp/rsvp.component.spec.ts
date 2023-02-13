import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpFormComponent } from './rsvp.component';

describe('RsvpComponent', () => {
  let component: RsvpFormComponent;
  let fixture: ComponentFixture<RsvpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsvpFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsvpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
