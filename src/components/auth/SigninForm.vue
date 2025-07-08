<template>
  <form>
    <h1>Sign In</h1>
    <div>
      <input type="text" id="email" name="email" placeholder="Enter your email" required />
    </div>

    <div>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter your Password"
        required
      />
    </div>

    <div>
      <button type="submit">Sign In</button>
    </div>
    <p>Or <a href="#">create an account</a>.</p>
  </form>
</template>
