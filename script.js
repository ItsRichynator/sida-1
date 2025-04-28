document.addEventListener("DOMContentLoaded", () => {
  // Get the current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  // Check and apply theme
  applyTheme()

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const mobileNav = document.getElementById("mobile-nav")

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden")
    })
  }

  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // If not logged in and not on login page, redirect to login
  if (!currentUser && currentPage !== "login.html") {
    window.location.href = "login.html"
    return
  }

  // Update user profile if logged in
  if (currentUser) {
    const usernameDisplays = document.querySelectorAll("#username-display, #mobile-username")
    const profilePics = document.querySelectorAll("#profile-pic-display, #mobile-profile-pic")

    usernameDisplays.forEach((display) => {
      if (display) {
        display.textContent = currentUser.username
      }
    })

    profilePics.forEach((pic) => {
      if (pic) {
        pic.src = currentUser.profilePicture
      }
    })

    // Add logout functionality
    const userProfiles = document.querySelectorAll("#user-profile")
    userProfiles.forEach((profile) => {
      if (profile) {
        profile.style.cursor = "pointer"
        profile.addEventListener("click", () => {
          if (confirm("Do you want to log out?")) {
            localStorage.removeItem("currentUser")
            window.location.href = "login.html"
          }
        })
      }
    })
  }

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle")

  if (themeToggle) {
    // Set initial state based on localStorage
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    themeToggle.checked = isDarkMode

    themeToggle.addEventListener("change", () => {
      toggleTheme(themeToggle.checked)
    })
  }

  if (mobileThemeToggle) {
    // Set initial state based on localStorage
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    mobileThemeToggle.checked = isDarkMode

    mobileThemeToggle.addEventListener("change", () => {
      toggleTheme(mobileThemeToggle.checked)
    })
  }

  // Login page functionality
  if (currentPage === "login.html") {
    // If already logged in, redirect to index
    if (currentUser) {
      window.location.href = "index.html"
      return
    }

    // Tab switching
    const tabs = document.querySelectorAll(".tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"))
        // Add active class to clicked tab
        this.classList.add("active")

        // Hide all tab contents
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active")
        })

        // Show the corresponding tab content
        const tabId = this.getAttribute("data-tab")
        document.getElementById(tabId + "-tab").classList.add("active")
      })
    })

    // Profile picture upload
    const uploadTrigger = document.getElementById("upload-trigger")
    const fileInput = document.getElementById("profile-image")
    const imagePreview = document.getElementById("profile-image-preview")

    if (uploadTrigger && fileInput && imagePreview) {
      uploadTrigger.addEventListener("click", () => {
        fileInput.click()
      })

      fileInput.addEventListener("change", function () {
        const file = this.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            imagePreview.src = e.target.result
          }
          reader.readAsDataURL(file)
        }
      })
    }

    // Ensure Guest user exists
    const users = JSON.parse(localStorage.getItem("users")) || []
    const guestUserExists = users.some((u) => u.username.toLowerCase() === "guest")

    if (!guestUserExists) {
      users.push({
        username: "Guest",
        password: "guest",
        profilePicture: "images/default-guest.png",
        ownedGames: [],
      })
      localStorage.setItem("users", JSON.stringify(users))
    }

    // Guest mode button in login tab
    const guestmode = document.getElementById("guestmode")
    if (guestmode) {
      guestmode.addEventListener("click", () => {
        loginAsGuest()
      })
    }

    // Guest mode button in register tab
    const guestLogin = document.getElementById("guest-login")
    if (guestLogin) {
      guestLogin.addEventListener("click", () => {
        loginAsGuest()
      })
    }

    // Function to login as guest
    function loginAsGuest() {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || []

      // Find guest user
      const guestUser = users.find((u) => u.username.toLowerCase() === "guest")

      if (guestUser) {
        // Set current user in localStorage
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
              username: guestUser.username,
              profilePicture: guestUser.profilePicture,
            }),
        )
        // Redirect to index page
        window.location.href = "index.html"
      } else {
        alert("Guest account not found. Please try again or create an account.")
      }
    }

    // Login form submission
    const loginForm = document.getElementById("login-form")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const username = document.getElementById("login-username").value
        const password = document.getElementById("login-password").value

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || []

        // Find user
        const user = users.find((u) => u.username === username && u.password === password)

        if (user) {
          // Set current user in localStorage
          localStorage.setItem(
              "currentUser",
              JSON.stringify({
                username: user.username,
                profilePicture: user.profilePicture,
              }),
          )

          // Redirect to index page
          window.location.href = "index.html"
        } else {
          alert("Invalid username or password")
        }
      })
    }

    // Register form submission
    const registerForm = document.getElementById("register-form")
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const username = document.getElementById("register-username").value
        const password = document.getElementById("register-password").value
        const confirmPassword = document.getElementById("register-confirm-password").value
        const profilePicture = document.getElementById("profile-image-preview").src

        // Validate passwords match
        if (password !== confirmPassword) {
          alert("Passwords do not match")
          return
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || []

        // Check if username already exists
        if (users.some((u) => u.username === username)) {
          alert("Username already exists")
          return
        }

        // Add new user
        users.push({
          username,
          password,
          profilePicture,
          ownedGames: [],
        })

        // Save users to localStorage
        localStorage.setItem("users", JSON.stringify(users))

        // Set current user
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
              username,
              profilePicture,
            }),
        )

        // Redirect to index page
        window.location.href = "index.html"
      })
    }
  }

  // Store page functionality
  if (currentPage === "store.html") {
    // Game data
    const games = [
      {
        id: 1,
        title: "Game 1",
        description: "Action-packed adventure with stunning graphics and immersive gameplay.",
        price: 59.99,
        image: "images/game1.png",
        link: "game1.html",
      },
      {
        id: 2,
        title: "Game 2",
        description: "Strategic RPG with deep character development and branching storylines.",
        price: 49.99,
        image: "images/game2.png",
        link: "game2.html",
      },
      {
        id: 3,
        title: "Game 3",
        description: "Open-world exploration with realistic physics and dynamic weather systems.",
        price: 69.99,
        image: "images/game3.png",
        link: "game3.html",
      },
      {
        id: 4,
        title: "Game 4",
        description: "Competitive multiplayer shooter with customizable loadouts and seasonal events.",
        price: 39.99,
        image: "images/game4.png",
        link: "game4.html",
      },
      {
        id: 5,
        title: "Game 5",
        description: "Indie puzzle game with unique art style and mind-bending challenges.",
        price: 24.99,
        image: "images/game5.png",
        link: "game5.html",
      },
    ]

    // Get user's owned games
    const users = JSON.parse(localStorage.getItem("users")) || []
    const user = users.find((u) => u.username === currentUser.username)

    if (!user) {
      window.location.href = "login.html"
      return
    }

    const ownedGames = user.ownedGames || []
    const ownedGameIds = ownedGames.map((game) => game.id)

    // Render games in store
    const storeGrid = document.getElementById("store-grid")
    const mobileStoreGrid = document.getElementById("mobile-store-grid")

    if (storeGrid && mobileStoreGrid) {
      games.forEach((game) => {
        const isOwned = ownedGameIds.includes(game.id)

        const gameCard = document.createElement("div")
        gameCard.className = "game-card"

        gameCard.innerHTML = `
                    <img src="${game.image}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <div class="price">$${game.price.toFixed(2)}</div>
                    ${
            isOwned
                ? `<div class="owned-badge">Owned</div>`
                : `<button class="buy-button" data-id="${game.id}">Buy Now</button>`
        }
                `

        // Clone for mobile
        const mobileGameCard = gameCard.cloneNode(true)

        // Add to grids
        storeGrid.appendChild(gameCard)
        mobileStoreGrid.appendChild(mobileGameCard)
      })

      // After creating game cards, add onerror handlers to all images
      document.querySelectorAll(".game-card img").forEach((img) => {
        img.onerror = function () {
          this.src = "https://via.placeholder.com/300x200"
        }
      })

      // Purchase functionality
      const modal = document.getElementById("purchase-modal")
      const gameTitle = document.getElementById("game-title")
      const gamePrice = document.getElementById("game-price")
      const closeModal = document.querySelector(".close-modal")
      const cancelPurchase = document.querySelector(".cancel-purchase")
      const confirmPurchase = document.querySelector(".confirm-purchase")

      let selectedGame = null

      // Add event listeners to buy buttons
      document.querySelectorAll(".buy-button").forEach((button) => {
        button.addEventListener("click", function () {
          const gameId = Number.parseInt(this.getAttribute("data-id"))
          selectedGame = games.find((game) => game.id === gameId)

          if (selectedGame) {
            gameTitle.textContent = selectedGame.title
            gamePrice.textContent = `$${selectedGame.price.toFixed(2)}`
            modal.classList.add("active")
          }
        })
      })

      // Close modal
      if (closeModal) {
        closeModal.addEventListener("click", () => {
          modal.classList.remove("active")
        })
      }

      if (cancelPurchase) {
        cancelPurchase.addEventListener("click", () => {
          modal.classList.remove("active")
        })
      }

      // Confirm purchase
      if (confirmPurchase) {
        confirmPurchase.addEventListener("click", () => {
          if (selectedGame) {
            // Add game to user's library
            user.ownedGames = user.ownedGames || []
            user.ownedGames.push(selectedGame)

            // Update user in localStorage
            const userIndex = users.findIndex((u) => u.username === user.username)
            if (userIndex !== -1) {
              users[userIndex] = user
              localStorage.setItem("users", JSON.stringify(users))
            }

            // Close modal
            modal.classList.remove("active")

            // Show success message
            alert(`You have successfully purchased ${selectedGame.title}!`)

            // Refresh page to update UI
            window.location.reload()
          }
        })
      }

      // Close modal when clicking outside
      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.remove("active")
        }
      })
    }
  }

  // Library page functionality
  if (currentPage === "library.html") {
    // Get user's owned games
    const users = JSON.parse(localStorage.getItem("users")) || []
    const user = users.find((u) => u.username === currentUser.username)

    if (!user) {
      window.location.href = "login.html"
      return
    }

    const ownedGames = user.ownedGames || []

    // Display owned games
    const libraryContainer = document.getElementById("library-container")
    const mobileLibraryContainer = document.getElementById("mobile-library-container")

    if (libraryContainer && mobileLibraryContainer) {
      if (ownedGames.length === 0) {
        // Display empty library message
        const emptyMessage = `
                    <div class="empty-library">
                        <h3>Your library is empty</h3>
                        <p>Visit the store to purchase games</p>
                        <a href="store.html" class="store-link">Go to Store</a>
                    </div>
                `

        libraryContainer.innerHTML = emptyMessage
        mobileLibraryContainer.innerHTML = emptyMessage
      } else {
        // Create grid for desktop
        const libraryGrid = document.createElement("div")
        libraryGrid.className = "library-grid"

        // Create grid for mobile
        const mobileLibraryGrid = document.createElement("div")
        mobileLibraryGrid.className = "library-grid"

        // Add each game to the grids
        ownedGames.forEach((game) => {
          const gameCard = `
                        <div class="game-card">
                            <img src="${game.image}" alt="${game.title}">
                            <h3>${game.title}</h3>
                            <p>${game.description}</p>
                            <a href="${game.link}" class="play-button">Play Now</a>
                        </div>
                    `

          libraryGrid.innerHTML += gameCard
          mobileLibraryGrid.innerHTML += gameCard
        })

        libraryContainer.appendChild(libraryGrid)
        mobileLibraryContainer.appendChild(mobileLibraryGrid)
      }
    }
  }

  // Add app settings functionality
  if (currentPage === "app-settings.html") {
    // Profile settings functionality
    const profileForm = document.getElementById("profile-form")
    const mobileProfileForm = document.getElementById("mobile-profile-form")
    const settingsProfilePreview = document.getElementById("settings-profile-preview")
    const mobileSettingsProfilePreview = document.getElementById("mobile-settings-profile-preview")
    const settingsUploadTrigger = document.getElementById("settings-upload-trigger")
    const mobileSettingsUploadTrigger = document.getElementById("mobile-settings-upload-trigger")
    const settingsProfileImage = document.getElementById("settings-profile-image")
    const mobileSettingsProfileImage = document.getElementById("mobile-settings-profile-image")
    const settingsUsername = document.getElementById("settings-username")
    const mobileSettingsUsername = document.getElementById("mobile-settings-username")
    const logoutButton = document.getElementById("logout-button")
    const mobileLogoutButton = document.getElementById("mobile-logout-button")

    // Get current user
    const users = JSON.parse(localStorage.getItem("users")) || []
    const user = users.find((u) => u.username === currentUser.username)

    // Set initial values
    if (settingsUsername) settingsUsername.value = currentUser.username
    if (mobileSettingsUsername) mobileSettingsUsername.value = currentUser.username
    if (settingsProfilePreview) settingsProfilePreview.src = currentUser.profilePicture
    if (mobileSettingsProfilePreview) mobileSettingsProfilePreview.src = currentUser.profilePicture

    // Profile picture upload
    if (settingsUploadTrigger && settingsProfileImage) {
      settingsUploadTrigger.addEventListener("click", () => {
        settingsProfileImage.click()
      })

      settingsProfileImage.addEventListener("change", function () {
        const file = this.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            settingsProfilePreview.src = e.target.result
          }
          reader.readAsDataURL(file)
        }
      })
    }

    if (mobileSettingsUploadTrigger && mobileSettingsProfileImage) {
      mobileSettingsUploadTrigger.addEventListener("click", () => {
        mobileSettingsProfileImage.click()
      })

      mobileSettingsProfileImage.addEventListener("change", function () {
        const file = this.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            mobileSettingsProfilePreview.src = e.target.result
          }
          reader.readAsDataURL(file)
        }
      })
    }

    // Save profile changes
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault()
        saveProfileChanges(
            settingsUsername.value,
            document.getElementById("settings-current-password").value,
            document.getElementById("settings-new-password").value,
            document.getElementById("settings-confirm-password").value,
            settingsProfilePreview.src,
        )
      })
    }

    if (mobileProfileForm) {
      mobileProfileForm.addEventListener("submit", (e) => {
        e.preventDefault()
        saveProfileChanges(
            mobileSettingsUsername.value,
            document.getElementById("mobile-settings-current-password").value,
            document.getElementById("mobile-settings-new-password").value,
            document.getElementById("mobile-settings-confirm-password").value,
            mobileSettingsProfilePreview.src,
        )
      })
    }

    // Logout functionality
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        logout()
      })
    }

    if (mobileLogoutButton) {
      mobileLogoutButton.addEventListener("click", () => {
        logout()
      })
    }

    // Function to save profile changes
    function saveProfileChanges(newUsername, currentPassword, newPassword, confirmPassword, profilePicture) {
      // Validate current password
      if (!user || user.password !== currentPassword) {
        alert("Current password is incorrect")
        return
      }

      // Check if new password fields match
      if (newPassword && newPassword !== confirmPassword) {
        alert("New passwords do not match")
        return
      }

      // Check if username already exists (if changing username)
      if (
          newUsername !== currentUser.username &&
          users.some((u) => u.username !== currentUser.username && u.username === newUsername)
      ) {
        alert("Username already exists")
        return
      }

      // Update user data
      const userIndex = users.findIndex((u) => u.username === currentUser.username)
      if (userIndex !== -1) {
        // Update username
        users[userIndex].username = newUsername

        // Update password if provided
        if (newPassword) {
          users[userIndex].password = newPassword
        }

        // Update profile picture
        users[userIndex].profilePicture = profilePicture

        // Save to localStorage
        localStorage.setItem("users", JSON.stringify(users))

        // Update current user
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
              username: newUsername,
              profilePicture: profilePicture,
            }),
        )

        alert("Profile updated successfully")

        // Reload page to reflect changes
        window.location.reload()
      }
    }

    // Function to handle logout
    function logout() {
      localStorage.removeItem("currentUser")
      window.location.href = "login.html"
    }
  }

  // Theme functions
  function toggleTheme(isDarkMode) {
    if (isDarkMode) {
      document.body.classList.add("dark-theme")
      localStorage.setItem("darkMode", "true")
    } else {
      document.body.classList.remove("dark-theme")
      localStorage.setItem("darkMode", "false")
    }

    // Sync the other toggle if it exists
    const otherToggle = themeToggle === document.activeElement ? mobileThemeToggle : themeToggle
    if (otherToggle) {
      otherToggle.checked = isDarkMode
    }
  }

  function applyTheme() {
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    if (isDarkMode) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }
})
