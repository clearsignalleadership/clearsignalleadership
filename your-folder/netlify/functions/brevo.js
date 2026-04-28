exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, name, listId } = JSON.parse(event.body);

  if (!email || !listId) {
    return { statusCode: 400, body: 'Missing email or listId' };
  }

  const firstName = name ? name.split(' ')[0] : '';
  const lastName = name ? name.split(' ').slice(1).join(' ') : '';

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: firstName, LASTNAME: lastName },
      listIds: [parseInt(listId)],
      updateEnabled: true,
      emailBlacklisted: false
    })
  });

  const status = response.ok || response.status === 204 || response.status === 201 ? 200 : 500;
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ success: status === 200 })
  };
};
