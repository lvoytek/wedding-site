import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeInputFormComponent } from './code-input-form.component';

describe('CodeInputFormComponent', () => {
  let component: CodeInputFormComponent;
  let fixture: ComponentFixture<CodeInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeInputFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
