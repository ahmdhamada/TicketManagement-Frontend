import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadge } from './status-badge';
import { TicketStatus } from '../../../core/models/enums';

describe('StatusBadge', () => {
  let component: StatusBadge;
  let fixture: ComponentFixture<StatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadge]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', TicketStatus.Open);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the status text', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Open');
  });

  it('derives a css class from the status', () => {
    fixture.componentRef.setInput('status', TicketStatus.InProgress);
    expect(component.cssClass).toBe('badge badge--inprogress');
  });
});
