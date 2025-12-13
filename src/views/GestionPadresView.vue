<template>
    <div class="wrapper">
      <!-- Sidebar -->
      <Sidebar />
      
      <div class="main-content">
        <div class="container-fluid">
          <h2 class="my-4">Gestión de Padres y Estudiantes</h2>
          
          <!-- Panel de búsqueda -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <label>Buscar Padre:</label>
                  <input v-model="searchParent" type="text" class="form-control" placeholder="Nombre, email..." @input="filterData">
                </div>
                <div class="col-md-6">
                  <label>Buscar Estudiante:</label>
                  <input v-model="searchStudent" type="text" class="form-control" placeholder="Nombre, email..." @input="filterData">
                </div>
              </div>
            </div>
          </div>
  
          <!-- Lista de relaciones -->
          <div class="card">
            <div class="card-header d-flex justify-content-between">
              <h4>Relaciones Padre-Estudiante</h4>
              <button @click="showAddModal = true" class="btn btn-primary">
                <i class="fas fa-plus"></i> Asignar Relación
              </button>
            </div>
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Padre</th>
                    <th>Estudiante</th>
                    <th>Email Estudiante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="rel in filteredRelations" :key="`${rel.parent.id_usuario}-${rel.student.id_estudiante}`">
                    <td>{{ rel.parent.nombre }} {{ rel.parent.apellido_paterno }}</td>
                    <td>{{ rel.student.nombre }} {{ rel.student.apellido_paterno }}</td>
                    <td>{{ rel.student.email }}</td>
                    <td>
                      <button @click="confirmDelete(rel.parent.id_usuario, rel.student.id_estudiante)" 
                              class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal para agregar relación -->
      <div v-if="showAddModal" class="modal-backdrop show"></div>
      <div v-if="showAddModal" class="modal show d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Asignar Padre a Estudiante</h5>
              <button @click="closeModal" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Seleccionar Padre</h6>
                  <select v-model="selectedParent" class="form-select">
                    <option v-for="parent in filteredParents" :value="parent.id_usuario" :key="parent.id_usuario">
                      {{ parent.nombre }} {{ parent.apellido_paterno }} ({{ parent.email }})
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <h6>Seleccionar Estudiante</h6>
                  <select v-model="selectedStudent" class="form-select">
                    <option v-for="student in filteredStudents" :value="student.id_estudiante" :key="student.id_estudiante">
                      {{ student.nombre }} {{ student.apellido_paterno }} ({{ student.email }})
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="closeModal" class="btn btn-secondary">Cancelar</button>
              <button @click="assignParent" class="btn btn-primary">Asignar</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de confirmación -->
      <div v-if="showConfirmModal" class="modal-backdrop show"></div>
      <div v-if="showConfirmModal" class="modal show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar Eliminación</h5>
              <button @click="showConfirmModal = false" class="btn-close"></button>
            </div>
            <div class="modal-body">
              ¿Está seguro que desea eliminar esta relación?
            </div>
            <div class="modal-footer">
              <button @click="showConfirmModal = false" class="btn btn-secondary">Cancelar</button>
              <button @click="deleteRelation" class="btn btn-danger">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '../components/Sidebar.vue';
  
  export default {
    components: {
      Sidebar
    },
    data() {
      return {
        relations: [], // Relaciones existentes
        parents: [], // Todos los padres
        students: [], // Todos los estudiantes
        searchParent: '',
        searchStudent: '',
        showAddModal: false,
        showConfirmModal: false,
        selectedParent: null,
        selectedStudent: null,
        parentToDelete: null,
        studentToDelete: null,
        allRelations: [] // Todas las relaciones obtenidas de la API
      }
    },
    computed: {
      filteredRelations() {
        return this.relations.filter(rel => {
          const parentMatch = rel.parent.nombre.toLowerCase().includes(this.searchParent.toLowerCase()) || 
                            rel.parent.email.toLowerCase().includes(this.searchParent.toLowerCase());
          const studentMatch = rel.student.nombre.toLowerCase().includes(this.searchStudent.toLowerCase()) || 
                             rel.student.email.toLowerCase().includes(this.searchStudent.toLowerCase());
          return parentMatch && studentMatch;
        });
      },
      filteredParents() {
        return this.parents.filter(parent => 
          parent.nombre.toLowerCase().includes(this.searchParent.toLowerCase()) ||
          parent.email.toLowerCase().includes(this.searchParent.toLowerCase())
        );
      },
      filteredStudents() {
        return this.students.filter(student => 
          student.nombre.toLowerCase().includes(this.searchStudent.toLowerCase()) ||
          student.email.toLowerCase().includes(this.searchStudent.toLowerCase())
        );
      }
    },
    methods: {
      async loadParents() {
        try {
          const response = await fetch('http://localhost:8080/api/users/rol/PADRE');
          if (!response.ok) throw new Error("Error al cargar padres");
          this.parents = await response.json();
          
          // Cargar hijos de cada padre
          await this.loadChildrenForParents();
        } catch (error) {
          console.error("Error cargando padres:", error);
          alert("Error al cargar los padres: " + error.message);
        }
      },
      async loadChildrenForParents() {
        this.allRelations = [];
        
        for (const parent of this.parents) {
          try {
            const response = await fetch(`http://localhost:8080/api/students/hijos/${parent.id_usuario}`);
            if (response.ok) {
              const hijos = await response.json();
              hijos.forEach(hijo => {
                this.allRelations.push({
                  parent: parent,
                  student: hijo
                });
              });
            }
          } catch (error) {
            console.error(`Error cargando hijos para padre ${parent.id_usuario}:`, error);
          }
        }
        
        this.relations = [...this.allRelations];
      },
      async loadStudents() {
        try {
          const response = await fetch('http://localhost:8080/api/students/estudiante_usuario');
          if (!response.ok) throw new Error("Error al cargar estudiantes");
          this.students = await response.json();
        } catch (error) {
          console.error("Error cargando estudiantes:", error);
          alert("Error al cargar los estudiantes: " + error.message);
        }
      },
      filterData() {
        if (this.searchParent === '' && this.searchStudent === '') {
          this.relations = [...this.allRelations];
        } else {
          this.relations = this.allRelations.filter(rel => {
            const parentMatch = rel.parent.nombre.toLowerCase().includes(this.searchParent.toLowerCase()) || 
                              rel.parent.email.toLowerCase().includes(this.searchParent.toLowerCase());
            const studentMatch = rel.student.nombre.toLowerCase().includes(this.searchStudent.toLowerCase()) || 
                               rel.student.email.toLowerCase().includes(this.searchStudent.toLowerCase());
            return parentMatch && studentMatch;
          });
        }
      },
      closeModal() {
        this.showAddModal = false;
        this.selectedParent = null;
        this.selectedStudent = null;
      },
      async assignParent() {
        if (!this.selectedParent || !this.selectedStudent) {
          alert('Seleccione padre y estudiante');
          return;
        }
        
        try {
          const response = await fetch('http://localhost:8080/api/students/conectar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              idPadre: this.selectedParent,
              idEstudiante: this.selectedStudent
            })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al asignar');
          }
  
          // Actualizamos la lista de relaciones
          await this.loadChildrenForParents();
          
          this.closeModal();
          alert('Relación asignada correctamente');
        } catch (error) {
          console.error("Error asignando relación:", error);
          alert("Error: " + error.message);
        }
      },
      confirmDelete(parentId, studentId) {
        this.parentToDelete = parentId;
        this.studentToDelete = studentId;
        this.showConfirmModal = true;
      },
      async deleteRelation() {
        try {
          const response = await fetch(
            `http://localhost:8080/api/students/conexion/${this.parentToDelete}/${this.studentToDelete}`, 
            { method: 'DELETE' }
          );
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar');
          }
  
          // Actualizamos la lista de relaciones
          await this.loadChildrenForParents();
          
          this.showConfirmModal = false;
          alert('Relación eliminada correctamente');
        } catch (error) {
          console.error("Error eliminando relación:", error);
          alert("Error: " + error.message);
        }
      }
    },
    async created() {
      await this.loadParents();
      await this.loadStudents();
    }
  }
  </script>
  
  <style scoped>
  .wrapper {
    display: flex;
    width: 100%;
  }
  
  .main-content {
    width: calc(100% - 250px);
    margin-left: 250px;
    padding: 20px;
  }
  
  .modal-backdrop {
    opacity: 0.5;
  }
  
  .table {
    margin-top: 20px;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .form-select, .form-control {
    margin-bottom: 15px;
  }
  
  .card {
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
  }
  
  .btn-primary {
    background-color: #3490dc;
    border-color: #3490dc;
  }
  
  .btn-danger {
    background-color: #e3342f;
    border-color: #e3342f;
  }
  </style>