<template>
  <div class="auth-layout">
    <div class="auth-card">
      <div class="auth-brand">
        <h1>METGO_3D</h1>
        <p>VIRTUALIZE · Generador de CV</p>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at top, #0b1120 0, #020617 50%, #020617 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #0f172a;
  border-radius: 1rem;
  padding: 2.5rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

.auth-brand {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-brand h1 {
  font-size: 1.8rem;
  color: #00d4aa;
  letter-spacing: 0.15em;
  margin-bottom: 0.25rem;
}

.auth-brand p {
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>
