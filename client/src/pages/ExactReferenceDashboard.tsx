import React from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import '../styles/exact-reference.css';

const ExactReferenceDashboard: React.FC = () => {
  return (
    <div className="app-container">
      <div className="dashboard-container">
        {/* Barra Lateral */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span>C.</span>
          </div>
          
          <div className="sidebar-menu">
            <div className="sidebar-item active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="6" height="6" x="3" y="3" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect width="6" height="6" x="15" y="3" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect width="6" height="6" x="3" y="15" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect width="6" height="6" x="15" y="15" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="sidebar-item">
              <BookOpen size={20} />
            </div>
            
            <div className="sidebar-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="sidebar-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <line x1="21.17" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" />
                <line x1="3.95" y1="6.06" x2="8.54" y2="14" stroke="currentColor" strokeWidth="2" />
                <line x1="10.88" y1="21.94" x2="15.46" y2="14" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </aside>
        
        {/* Conteúdo Principal */}
        <main className="main-content">
          <div className="dashboard-wrapper">
            {/* Header */}
            <header className="header">
              <h1 className="page-title">Welcome back 👋</h1>
              
              <div className="header-actions">
                <div className="search-bar">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search something"
                  />
                  <Search size={16} className="search-icon" />
                </div>
                
                <div className="user-avatar">
                  <img src="https://ui-avatars.com/api/?name=U&background=FFB6C1&color=FFF" alt="User" />
                </div>
              </div>
            </header>
            
            {/* Layout de Duas Colunas */}
            <div className="two-column-layout">
              {/* Primeira Coluna - Atividades */}
              <div className="activities-column">
                <h2 className="section-title">
                  Your activities today <span className="activities-count">(5)</span>
                </h2>
                
                {/* Cards de Atividades */}
                <div className="activities-grid">
                  <div className="activity-card">
                    <div className="activity-card-header">
                      <div className="users-group">
                        {[1, 2, 3, 4].map(i => (
                          <div 
                            key={i} 
                            className="user-dot" 
                            style={{
                              backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`,
                              backgroundSize: 'cover',
                              zIndex: 5 - i
                            }}
                          />
                        ))}
                        <div className="more-users">+6</div>
                      </div>
                      
                      <div className="rating-badge">
                        <span className="rating-star">★</span>
                        <span>4.9</span>
                      </div>
                    </div>
                    
                    <h3 className="activity-title">UX/UI Design</h3>
                    
                    <button className="action-button">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  
                  <div className="activity-card pink">
                    <div className="activity-card-header">
                      <div className="users-group">
                        {[5, 6, 7, 8].map(i => (
                          <div 
                            key={i} 
                            className="user-dot" 
                            style={{
                              backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`,
                              backgroundSize: 'cover',
                              zIndex: 5 - i
                            }}
                          />
                        ))}
                        <div className="more-users">+6</div>
                      </div>
                      
                      <div className="rating-badge">
                        <span className="rating-star">★</span>
                        <span>4.8</span>
                      </div>
                    </div>
                    
                    <h3 className="activity-title">Analytics Tools</h3>
                    
                    <button className="action-button">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                
                <h2 className="section-title">Learning progress</h2>
                
                {/* Cards de Estatísticas */}
                <div className="stats-grid">
                  <div className="stat-card green">
                    <h3 className="stat-value">18</h3>
                    <p className="stat-label">Completed</p>
                    
                    <button className="action-button">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  
                  <div className="stat-card yellow">
                    <h3 className="stat-value">72</h3>
                    <p className="stat-label">Your score</p>
                    
                    <button className="action-button">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  
                  <div className="stat-card purple">
                    <h3 className="stat-value">11</h3>
                    <p className="stat-label">Active</p>
                    
                    <button className="action-button">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Cards de Progresso */}
                <div className="progress-cards">
                  <div className="progress-card yellow">
                    <div className="progress-header">
                      <div className="category-badge">IT & Software</div>
                      <ArrowRight size={16} />
                    </div>
                    
                    <div className="progress-indicator">11/24 lessons</div>
                    
                    <h3 className="progress-title">Interface motion</h3>
                    
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div className="progress-card pink">
                    <div className="progress-header">
                      <div className="category-badge">IT & Software</div>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Segunda Coluna - Calendário */}
              <div className="calendar-column">
                <h2 className="section-title">Lesson schedule</h2>
                
                <div className="calendar-wrapper">
                  <div className="calendar-header">
                    <h3 className="calendar-title">July 2024</h3>
                    
                    <div className="calendar-controls">
                      <button className="calendar-control">
                        <ChevronLeft size={18} />
                      </button>
                      <button className="calendar-control">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Dias da Semana */}
                  <div className="weekdays-grid">
                    <div className="weekday">MON</div>
                    <div className="weekday">TUE</div>
                    <div className="weekday">WED</div>
                    <div className="weekday">THU</div>
                    <div className="weekday">FRI</div>
                    <div className="weekday">SAT</div>
                    <div className="weekday">SUN</div>
                  </div>
                  
                  {/* Grid de Dias */}
                  <div className="calendar-grid">
                    <div className="calendar-day inactive">30</div>
                    <div className="calendar-day">1</div>
                    <div className="calendar-day">2</div>
                    <div className="calendar-day">3</div>
                    <div className="calendar-day">4</div>
                    <div className="calendar-day">5</div>
                    <div className="calendar-day">6</div>
                    
                    <div className="calendar-day">7</div>
                    <div className="calendar-day">8</div>
                    <div className="calendar-day active">9</div>
                    <div className="calendar-day">10</div>
                    <div className="calendar-day">11</div>
                    <div className="calendar-day active">12</div>
                    <div className="calendar-day">13</div>
                    
                    <div className="calendar-day">14</div>
                    <div className="calendar-day">15</div>
                    <div className="calendar-day">16</div>
                    <div className="calendar-day current">17</div>
                    <div className="calendar-day">18</div>
                    <div className="calendar-day">19</div>
                    <div className="calendar-day">20</div>
                    
                    <div className="calendar-day">21</div>
                    <div className="calendar-day">22</div>
                    <div className="calendar-day">23</div>
                    <div className="calendar-day">24</div>
                    <div className="calendar-day">25</div>
                    <div className="calendar-day">26</div>
                    <div className="calendar-day">27</div>
                    
                    <div className="calendar-day">28</div>
                    <div className="calendar-day">29</div>
                    <div className="calendar-day">30</div>
                    <div className="calendar-day">31</div>
                    <div className="calendar-day inactive">1</div>
                    <div className="calendar-day inactive">2</div>
                    <div className="calendar-day inactive">3</div>
                  </div>
                  
                  {/* Lista de Eventos */}
                  <div className="events-list">
                    <div className="event-card">
                      <div className="event-icon">
                        <BookOpen size={14} />
                      </div>
                      <span className="event-title">Webinar "How to create a web hierarchy?"</span>
                    </div>
                    
                    <div className="event-card">
                      <div className="event-icon">
                        <BookOpen size={14} />
                      </div>
                      <span className="event-title">Lesson "Client psychology and communication strategy?"</span>
                    </div>
                    
                    <div className="event-card">
                      <div className="event-icon">
                        <BookOpen size={14} />
                      </div>
                      <span className="event-title">Lesson "Colour gradients"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExactReferenceDashboard;