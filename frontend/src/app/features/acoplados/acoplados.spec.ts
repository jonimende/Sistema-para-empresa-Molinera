import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acoplados } from './acoplados';

describe('Acoplados', () => {
  let component: Acoplados;
  let fixture: ComponentFixture<Acoplados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acoplados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acoplados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
