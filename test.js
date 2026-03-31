fetch('https://login.clinicaequilibrar.cl/api/data/users').then(r=>r.json()).then(u=>{
  fetch('https://login.clinicaequilibrar.cl/api/data/appointments').then(r=>r.json()).then(a=>{
    const appts = a || [];
    const withAppts = new Set(appts.map(x=>x.clientId).filter(Boolean));
    const filtered = u.filter(x => ['CLIENT', 'Cliente', 'USER', 'CLIENTE'].includes(x.role) && withAppts.has(x.id));
    console.log("Appointments count: " + appts.length);
    console.log("Unique client IDs in appointments: " + withAppts.size);
    console.log("Filtered users to show in directory: " + filtered.length);
  })
})
