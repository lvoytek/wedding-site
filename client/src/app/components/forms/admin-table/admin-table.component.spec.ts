import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTableComponent } from './admin-table.component';

describe('AddGuestComponent', () => {
  let component: AddGuestComponent;
  let fixture: ComponentFixture<AddGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGuestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
