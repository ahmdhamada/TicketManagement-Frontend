import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private readonly http: HttpClient) {}

  getComments(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/tickets/${ticketId}/comments`);
  }

  addComment(ticketId: number, body: string): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}/tickets/${ticketId}/comments`, { body });
  }
}
