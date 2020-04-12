self.addEventListener('fetch', (event) => {
  event.respondWith(handler(event.request));
});

const corsHeaders = {
  'Access-Control-Allow-Origin': CORS_ALLOW,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function handler(request) {
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest(request);
  }

  if (request.method === 'POST') {
    return handlePostRequest(request);
  }

  // Return "Method Not Allowed" status
  return new Response(null, { status: 405 });
}

function handleOptionsRequest(request) {
  // CORS pre-flight request
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Normal OPTIONS request
  return new Response(null, {
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}

async function handlePostRequest(request) {
  if (request.headers.get('Content-Type') !== 'application/json') {
    return new Response(null, {
      status: 415,
      headers: corsHeaders,
    });
  }

  const data = await request.json().catch((e) => null);
  const hasRequiredFields = data && data.name && data.email && data.message;
  if (!hasRequiredFields) {
    return new Response(null, {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    await saveInAirtable(data);
  } catch (e) {
    return new Response(null, {
      status: 502,
      headers: corsHeaders,
    });
  }

  return new Response(null, {
    status: 201,
    headers: corsHeaders,
  });
}

async function saveInAirtable(data) {
  const endpoint = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: data.name,
            Email: data.email,
            Message: data.message,
          },
        },
      ],
    }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch((e) => null);

    if (errorData && errorData.error && errorData.message) {
      throw new Error(`${errorData.error}: ${errorData.message}`);
    }

    throw new Error(`${resp.status}: ${resp.statusText}`);
  }
}
