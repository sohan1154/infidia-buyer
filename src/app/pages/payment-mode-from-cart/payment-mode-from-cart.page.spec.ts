import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentModeFromCartPage } from './payment-mode-from-cart.page';

describe('PaymentModeFromCartPage', () => {
  let component: PaymentModeFromCartPage;
  let fixture: ComponentFixture<PaymentModeFromCartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentModeFromCartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentModeFromCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
