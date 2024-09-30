import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunaFormComponent } from './runa-form.component';

describe('RunaFormComponent', () => {
  let component: RunaFormComponent;
  let fixture: ComponentFixture<RunaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
