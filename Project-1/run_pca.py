import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# =============================================================================
# PART 1: THE "WHY" - A VISUAL DEMONSTRATION
# =============================================================================

# Create a high-dimensional dataset (10 dimensions) with 3 distinct clusters
X, y = make_blobs(n_samples=300, centers=3, n_features=10, random_state=42)
print(f"Original data shape: {X.shape}")

# Plot the data using only the first two dimensions
plt.figure(figsize=(14, 6))
plt.subplot(1, 2, 1)
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='viridis', edgecolor='k', s=50)
plt.title("Original Data (Plotting First 2 of 10 Dimensions)")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.grid(True)

# Use PCA to reduce the data from 10 dimensions to 2
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
print(f"Data shape after PCA: {X_pca.shape}")

# Plot the data after PCA transformation
plt.subplot(1, 2, 2)
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', edgecolor='k', s=50)
plt.title("Data After PCA (2 Principal Components)")
plt.xlabel("Principal Component 1")
plt.ylabel("Principal Component 2")
plt.grid(True)

plt.suptitle("Why Use PCA? Improving Data Visualization", fontsize=16)

# Save the first plot
plt.savefig('images/pca_visualization.png')
plt.show()


# =============================================================================
# PART 2: THE "HOW" - A STEP-BY-STEP BREAKDOWN
# =============================================================================

print("\n" + "="*50)
print("HOW PCA WORKS: A STEP-BY-STEP BREAKDOWN")
print("="*50 + "\n")

# Step 1: Standardization (already done as X_scaled)
print("Step 1: Data has been standardized.")

# Step 2: Covariance Matrix Calculation
cov_matrix = np.cov(X_scaled.T)
print(f"Step 2: Covariance Matrix calculated. Shape: {cov_matrix.shape}")

# Step 3: Calculate Eigenvectors and Eigenvalues
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)
print("Step 3: Eigenvectors and Eigenvalues calculated.")

# Step 4: Select Principal Components
sorted_indices = np.argsort(eigenvalues)[::-1]
sorted_eigenvalues = eigenvalues[sorted_indices]
sorted_eigenvectors = eigenvectors[:, sorted_indices]
explained_variance_ratio = sorted_eigenvalues / np.sum(sorted_eigenvalues)
print("\nStep 4: Ranking Principal Components by Explained Variance:")
for i, ratio in enumerate(explained_variance_ratio[:5]):
    print(f"  - Principal Component {i+1}: explains {ratio:.2%} of the variance")

# Step 5: Transform the Data
projection_matrix = sorted_eigenvectors[:, :2]
X_manual_pca = X_scaled.dot(projection_matrix)

# Plot the manually transformed data
plt.figure(figsize=(7, 6))
plt.scatter(X_manual_pca[:, 0], X_manual_pca[:, 1], c=y, cmap='viridis', edgecolor='k', s=50)
plt.title("Data Transformed Manually (Matches Scikit-learn!)")
plt.xlabel("Principal Component 1")
plt.ylabel("Principal Component 2")
plt.grid(True)

# Save the second plot
plt.savefig('images/pca_manual_transform.png')
plt.show()

print("\nCode finished running. Check for 'pca_visualization.png' and 'pca_manual_transform.png'.")