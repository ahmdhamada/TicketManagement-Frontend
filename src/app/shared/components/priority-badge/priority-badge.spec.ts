import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityBadge } from './priority-badge';
import { TicketPriority } from '../../../core/models/enums';

describe('PriorityBadge', () => {
  let component: PriorityBadge;
  let fixture: ComponentFixture<PriorityBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityBadge]
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('priority', TicketPriority.Critical);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the priority text', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Critical');
  });
});
