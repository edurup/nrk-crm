import axios from "axios";


const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3001/api"
});


// attach token automatically
// attach token automatically
api.interceptors.request.use(
  (config) => {

    if (typeof window !== "undefined") {

      const token = localStorage.getItem("crmToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);



export const getLeads = async () => {

    const response = await api.get(
        "/crm/leads"
    );

    return response.data;

};


export const loginCRM = async(
    email:string,
    password:string
)=>{

    const response = await api.post(
        "/crm/auth/login",
        {
            email,
            password
        }
    );


    return response.data;

};

export const updateLeadStatus = async (
    id: string,
    status: string
  ) => {
    const response = await api.patch(`/crm/leads/${id}/status`, {
      status,
    });
  
    return response.data;
  };

  export const updateLeadAssignment = async (
    id: string,
    assignedTo: string
  ) => {
    const response = await api.patch(`/crm/leads/${id}/assign`, {
      assignedTo,
    });
  
    return response.data;
  };

  export const createLead = async (leadData:any) => {
    const response = await api.post(
      "/crm/leads",
      leadData
    );
  
    return response.data;
  };

  // Google Integration APIs

export const getGoogleIntegration = async () => {
  const response = await api.get("/crm/integrations/google");
  return response.data;
};

export const getGoogleConnectUrl = async () => {
  const response = await api.get("/crm/integrations/google/connect");
  return response.data;
};

export const getGoogleSheets = async () => {
  const response = await api.get("/crm/integrations/google/sheets");
  return response.data;
};

export const getGoogleWorksheets = async (
  spreadsheetId: string
) => {
  const response = await api.get(
    `/crm/integrations/google/worksheets/${spreadsheetId}`
  );

  return response.data;
};

export default api;

export const previewGoogleSheet = async (
  spreadsheetId: string,
  worksheetName: string
) => {
  const response = await api.get(
    "/crm/integrations/google/preview",
    {
      params: {
        spreadsheetId,
        worksheetName,
      },
    }
  );

  return response.data;
};

export const saveGoogleConfiguration = async (data: {
  spreadsheetId: string;
  spreadsheetName: string;
  worksheetName: string;
}) => {
  const response = await api.patch(
    "/crm/integrations/google/config",
    data
  );

  return response.data;
};

export const importGoogleLeads = async () => {
  const response = await api.post(
    "/crm/integrations/google/import"
  );

  return response.data;
};

export const getImportedSheets = async () => {
  const response = await api.get(
    "/crm/integrations/google/imported-sheets"
  );

  return response.data;
};

export const getImportedSheet = async (id: string) => {
  const { data } = await api.get(
    `/crm/integrations/google/imported-sheets/${id}`
  );

  return data;
};

export const deleteImportedSheet = async (id: string) => {
  const { data } = await api.delete(
    `/crm/integrations/google/imported-sheets/${id}`
  );

  return data;
};

// Lead field update APIs
export const updateLeadDemo = async (
  id: string,
  demo: string,
  demoDateTime?: string
) => {
  const response = await api.put(`/crm/leads/${id}`, {
    demo,
    demoDateTime,
  });
  return response.data;
};

export const updateLeadPriority = async (
  id: string,
  leadPriority: string
) => {
  const response = await api.put(`/crm/leads/${id}`, {
    leadPriority,
  });
  return response.data;
};

export const updateLeadFollowUp = async (
  id: string,
  nextFollowUp: string
) => {
  const response = await api.put(`/crm/leads/${id}`, {
    nextFollowUp,
  });
  return response.data;
};

export const updateLeadNotes = async (
  id: string,
  leadNotes: string
) => {
  const response = await api.put(`/crm/leads/${id}`, {
    leadNotes,
  });
  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  // Get current user to determine which endpoint to use
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crmUser') || '{}') : {};
  const isAdmin = currentUser.role === 'admin' || !currentUser.role;
  
  const endpoint = isAdmin 
    ? '/crm/auth/change-password' 
    : '/crm/users/change-password';
    
  const response = await api.patch(endpoint, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const markWhatsAppSent = async (
  id: string,
  message: string
) => {
  const response = await api.put(
    `/crm/leads/${id}/whatsapp`,
    {
      message,
    }
  );

  return response.data;
};

export const getWhatsAppHistory = async () => {
  const response = await api.get("/crm/whatsapp/history");
  return response.data;
};

export const deleteLead = async (id: string) => {
  const response = await api.delete(
    `/crm/leads/${id}`
  );

  return response.data;
};

// CRM User Management APIs (Admin only)
export const createCRMUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role?: string;
  assignedCourses?: string[];
}) => {
  const response = await api.post("/crm/users/create", userData);
  return response.data;
};

export const getAllCRMUsers = async () => {
  const response = await api.get("/crm/users/all");
  return response.data;
};

export const deleteCRMUser = async (id: string) => {
  const response = await api.delete(`/crm/users/${id}`);
  return response.data;
};