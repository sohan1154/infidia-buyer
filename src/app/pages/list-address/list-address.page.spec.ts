import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListAddressPage } from './list-address.page';

describe('ListAddressPage', () => {
  let component: ListAddressPage;
  let fixture: ComponentFixture<ListAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAddressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
