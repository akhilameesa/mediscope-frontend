const API_BASE = '/api/v1';

export const apiClient = {
  getToken() {
    return localStorage.getItem('mediscope_token');
  },

  setToken(token) {
    localStorage.setItem('mediscope_token', token);
  },

  clearToken() {
    localStorage.removeItem('mediscope_token');
    localStorage.removeItem('mediscope_user');
  },

  getUser() {
    try {
      const u = localStorage.getItem('mediscope_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem('mediscope_user', JSON.stringify(user));
  },

  async request(endpoint, options = {}) {
    const headers = options.headers || {};
    const token = this.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.detail || 'An unexpected error occurred');
      error.status = response.status;
      error.detail = data.detail;
      throw error;
    }

    return data;
  },

  // Auth APIs
  async checkUser(email) {
    return this.request('/auth/check-user', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async register(full_name, email, password, consent_granted = true) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password, consent_granted })
    });
    this.setToken(res.access_token);
    this.setUser(res.user);
    return res;
  },

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.access_token);
    this.setUser(res.user);
    return res;
  },

  async getMe() {
    return this.request('/auth/me');
  },

  logout() {
    this.clearToken();
  },

  // Patients APIs
  async getPatients() {
    return this.request('/patients');
  },

  async createPatient(payload) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updatePatient(patientId, payload) {
    return this.request(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  async deletePatient(patientId) {
    return this.request(`/patients/${patientId}`, {
      method: 'DELETE'
    });
  },

  // Reports & OCR APIs
  async uploadReport(patientId, file, reportName = 'Diagnostic Lab Report', reportDate = '', presetType = '') {
    const formData = new FormData();
    formData.append('patient_id', patientId);
    formData.append('report_name', reportName);
    if (reportDate) formData.append('report_date', reportDate);
    if (file) formData.append('file', file);
    if (presetType) formData.append('preset_type', presetType);

    return this.request('/reports/upload', {
      method: 'POST',
      body: formData
    });
  },

  async getPatientTrends(patientId) {
    return this.request(`/reports/${patientId}/trends`);
  },

  async getDoctorQuestions(patientId) {
    return this.request(`/reports/${patientId}/doctor-questions`);
  },

  // Specialists APIs
  async getSpecialists(patientId = null) {
    const q = patientId ? `?patient_id=${patientId}` : '';
    return this.request(`/doctors/specialists${q}`);
  },

  // Outbreaks & Stats APIs
  async getOutbreaks() {
    return this.request('/health/outbreaks');
  },

  // Email Reminders APIs
  async getReminders() {
    return this.request('/reminders');
  },

  async scheduleReminder(patientId, scheduledDate, reminderType = 'ANNUAL_CHECKUP', frequency = 'ANNUAL') {
    return this.request('/reminders/schedule', {
      method: 'POST',
      body: JSON.stringify({
        patient_id: patientId,
        scheduled_date: scheduledDate,
        reminder_type: reminderType,
        frequency
      })
    });
  },

  async sendTestEmail(patientId = null, reminderType = 'ANNUAL_CHECKUP', customRecipientEmail = null) {
    return this.request('/reminders/send-test-email', {
      method: 'POST',
      body: JSON.stringify({
        patient_id: patientId,
        reminder_type: reminderType,
        custom_recipient_email: customRecipientEmail
      })
    });
  },

  async getLegal() {
    return this.request('/meta/legal');
  }
};
