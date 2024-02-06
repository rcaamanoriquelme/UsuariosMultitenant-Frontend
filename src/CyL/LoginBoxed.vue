<template>
  <div>
    <div class="h-100 bg-plum-plate bg-animation">
      <div class="d-flex h-100 justify-content-center align-items-center">
        <b-col md="8" class="mx-auto app-login-box">
          <div class="app-logo-inverse mx-auto mb-3" />

          <div class="modal-dialog w-100 mx-auto">
            <div class="modal-content">
              <div class="modal-body">
                <div class="h5 modal-title text-center">
                  <h4 class="mt-2">
                    <div>Bienvenido</div>
                    <span>Inicie sesión en su cuenta.</span>
                  </h4>
                </div>

                <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
                  <b-form-input id="exampleInput1" type="text" v-model="email" required placeholder="Entre login..."></b-form-input>
                </b-form-group>
                <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
                  <b-form-input id="exampleInput2" type="password" v-model="password" required placeholder="Entre password..."></b-form-input>
                </b-form-group>

              </div>
              <div class="modal-footer clearfix">
                <div class="text-center">
                  <b-button variant="primary" size="lg" @click.prevent="loginforus">Ingresar</b-button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center text-white opacity-8 mt-3">Copyright &copy; BBR 2023
          <p>Fecha de Compilación: {{ dateCompilation }} Versión: {{ version }}</p>
          </div>
        </b-col>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "../services/auth.service";
import config from '../../config.js'                                                                                                                                                                                              

export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      dateCompilation: config.dateCompilation,
      version: config.version
    };
  },
  methods: {
    async loginforus() {
      try {
        const response = await AuthService.login(this.email, this.password);
        if (response) {
          localStorage.setItem('userData', JSON.stringify(response.usuario));
          this.$router.push("/CyL/product");
        } else {
          alert("Usuario o contraseña incorrectos");
        }
      } catch (error) {
        console.error(error);
        alert("Error durante el inicio de sesión");
      }
    }
  }
};
</script>
