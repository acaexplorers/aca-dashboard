import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClanCouncilFormComponent } from './clan-council-form.component';

describe('ClanCouncilFormComponent', () => {
  let component: ClanCouncilFormComponent;
  let fixture: ComponentFixture<ClanCouncilFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClanCouncilFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClanCouncilFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
